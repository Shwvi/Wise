import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Collapse,
  Divider,
  IconButton,
  InputBase,
  List,
  ListItemButton,
  Paper,
  Typography,
} from "@mui/material";
import React, {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc";
import styles from "./siderbar.less";
import {
  DocNodeState,
  selectNodesFromIds,
  usePopPathStack,
} from "../state/core";
import { createNode, modifyNode } from "../../api/request";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { FallBack } from "./Fallbacks";
import { INode, INodeIdentifier } from "@wise/common";
import { useCurrentNode, useSetCurrentNode } from "@/hook/useCurrentNode";
import { IToggleButtonGroup } from "./IToggleButtonGroup";
import { useSubScribeNodeFilterState } from "../state";

function DocNodeButton({
  node,
  filterText,
  pop,
}: {
  node: INode;
  filterText: string;
  pop: (id: string) => void;
}) {
  const setNewNode = useRecoilCallback(
    ({ set }) =>
      (node: INode) => {
        set(DocNodeState(node.nodeId), node);
      },
    []
  );
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(node.props.name);
  useEffect(() => {
    setName(node.props.name);
  }, [node]);
  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
    }
  }, [editing]);
  return node.props.name.includes(filterText) ? (
    <SiderButton onClick={() => pop(node.nodeId)}>
      <Typography variant="button">
        {editing ? (
          <input
            ref={inputRef}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onBlur={() => {
              const newNode = {
                ...node,
                props: {
                  ...node.props,
                  name,
                },
              };
              modifyNode(newNode)
                .then((d) => {
                  if (d) {
                    setNewNode(newNode);
                  }
                })
                .finally(() => {
                  setEditing(false);
                });
            }}
            className="p-1"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
            }}
            onChange={(e) => {
              setName(e.target.value);
            }}
            value={name}
          />
        ) : (
          <span
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              e.nativeEvent.stopImmediatePropagation();
              e.nativeEvent.stopPropagation();
              setEditing(true);
            }}
            className={`${
              node.props.isDeleted ? "text-red-500 line-through" : ""
            } cursor-text`}
          >
            {node.props.name}
          </span>
        )}
      </Typography>
    </SiderButton>
  ) : null;
}
const SortableItem = SortableElement(
  (props: { node: INode; filterText: string; pop: (id: string) => void }) => (
    <DocNodeButton {...props} key={props.node.nodeId} />
  )
);
const SortableList = SortableContainer(
  ({
    items,
    filterText,
    pop,
  }: {
    items: INode[];
    filterText: string;
    pop: (id: string) => void;
  }) => {
    return (
      <div className="overflow-auto">
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value.nodeId}`}
            index={index}
            node={value}
            filterText={filterText}
            pop={pop}
          />
        ))}
      </div>
    );
  }
);
function SiderButton(props: { onClick?: () => void; children: ReactNode }) {
  const { onClick, children } = props;
  return (
    <>
      <ListItemButton onClick={onClick}>
        <span className=" max-w-full overflow-hidden whitespace-nowrap overflow-ellipsis">
          {children}
        </span>
      </ListItemButton>
    </>
  );
}
function NodeButtonList({
  nodeIds,
  filterText,
}: {
  nodeIds: INodeIdentifier[];
  filterText: string;
}) {
  const setCurrentNode = useSetCurrentNode();
  const { pop } = usePopPathStack();
  const items = useRecoilValue(selectNodesFromIds(nodeIds));
  const node = useCurrentNode();
  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      const newNode = {
        ...node!,
        props: {
          ...node!.props,
          children: arrayMove(node!.props.children, oldIndex, newIndex),
        },
      };
      modifyNode(newNode).then((d) => {
        if (d) {
          setCurrentNode(newNode);
        }
      });
    },
    [node, setCurrentNode]
  );
  const { value: nodeFilter } = useSubScribeNodeFilterState();
  const realNodes = useMemo(() => {
    let cur = items;
    if (!nodeFilter.includes("completed")) {
      cur = cur.filter((c) => !c.props.isCompleted);
    }
    if (!nodeFilter.includes("uncompleted")) {
      cur = cur.filter((c) => c.props.isCompleted === true);
    }
    if (!nodeFilter.includes("deleted")) {
      cur = cur.filter((c) => c.props.isDeleted !== true);
    }
    return cur;
  }, [items, nodeFilter]);
  if (!node) return <div>Erro No Node selected</div>;
  return (
    <SortableList
      pop={pop}
      items={realNodes}
      onSortEnd={onSortEnd}
      filterText={filterText}
      distance={1}
    />
  );
}
export function SiderBar({ node }: { node: INode }) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const setNewNode = useRecoilCallback(
    ({ set }) =>
      (node: INode) => {
        set(DocNodeState(node.nodeId), node);
      },
    []
  );
  const addNode = useCallback(async () => {
    setAdding(true);
    const {
      props: { children },
      nodeId,
    } = node;
    const newId = nodeId + `_${children.length}`;
    const newNode = {
      nodeId: newId,
      props: {
        children: [],
        name: "untitled",
      },
    };
    const res = await createNode(newNode);
    if (res) {
      setNewNode(newNode);
      setNewNode({
        ...node,
        props: {
          ...node.props,
          children: [...node.props.children, newNode.nodeId],
        },
      });
    }
    setAdding(false);
  }, [node, setNewNode]);
  const [filterText, setFilterTex] = useState("");

  return (
    <Collapse
      orientation="horizontal"
      in={open}
      collapsedSize={"3rem"}
      className=" h-full pt-3 overflow-scroll relative"
    >
      <div className="absolute w-full h-full bg-gray-200 opacity-30 dark:bg-black top-0 left-0 border-r-2 border-gray-50"></div>
      <List
        className={`${styles.ulOverflow} flex flex-col`}
        sx={{
          minWidth: "14rem",
          maxWidth: "14rem",
        }}
      >
        {open && (
          <>
            <div className="w-full flex justify-center mb-4">
              <div className="flex items-center w-11/12">
                <Paper sx={{ display: "flex" }}>
                  <InputBase
                    onChange={(e) => {
                      setFilterTex(e.target.value);
                    }}
                    value={filterText}
                    sx={{ ml: 1, flex: 1 }}
                    placeholder="Search"
                    inputProps={{ "aria-label": "search google maps" }}
                  />
                  <IconButton aria-label="delete" size="small" disabled>
                    <SearchIcon fontSize="inherit" />
                  </IconButton>
                  <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
                  <IconButton
                    sx={{ p: "1px" }}
                    onClick={addNode}
                    size="small"
                    disableRipple
                  >
                    {adding ? (
                      <LoopSharpIcon className="animate-spin" />
                    ) : (
                      <AddIcon />
                    )}
                  </IconButton>
                </Paper>
              </div>
            </div>
            <React.Suspense fallback={<FallBack coverclassname="p-4" />}>
              <NodeButtonList
                filterText={filterText}
                nodeIds={node.props.children}
              />
            </React.Suspense>
          </>
        )}
        <div>
          <SiderButton onClick={() => setOpen((o) => !o)}>
            <KeyboardArrowDown
              sx={{
                opacity: 1,
                transform: open ? "rotate(-270deg)" : "rotate(-90deg)",
                transition: "0.2s",
              }}
            />
          </SiderButton>
        </div>
        <div className="flex-1" />
        {open && (
          <div className="items-end pr-2 pl-2">
            <IToggleButtonGroup />
          </div>
        )}
      </List>
    </Collapse>
  );
}
