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
import React, { ReactNode, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import LoopSharpIcon from "@mui/icons-material/LoopSharp";
import {
  arrayMove,
  SortableContainer,
  SortableElement,
} from "react-sortable-hoc";
import styles from "./siderbar.less";
import { DocNodeState, usePopPathStack } from "../state/core";
import { createNode, modifyNode } from "../../api/request";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { FallBack } from "./Fallbacks";
import { INode } from "@wise/common";
import { useSetCurrentNode } from "@/hook/useCurrentNode";
import { getSnackbar } from "../lib/globalMessage";

function DocNodeButton({
  nodeId,
  filterText,
}: {
  nodeId: string;
  filterText: string;
}) {
  const node = useRecoilValue(DocNodeState(nodeId));
  const { pop } = usePopPathStack();
  return node.props.name.includes(filterText) ? (
    <SiderButton onClick={() => pop(node.nodeId)}>
      <Typography variant="button">
        <span
          className={`${
            node.props.isDeleted ? "text-red-500 line-through" : ""
          }`}
        >
          {node.props.name}
        </span>
      </Typography>
    </SiderButton>
  ) : null;
}
const SortableItem = SortableElement(
  (props: { nodeId: string; filterText: string }) => (
    <DocNodeButton {...props} />
  )
);
const SortableList = SortableContainer(
  ({ items, filterText }: { items: string[]; filterText: string }) => {
    return (
      <div>
        {items.map((value, index) => (
          <SortableItem
            key={`item-${value}`}
            index={index}
            nodeId={value}
            filterText={filterText}
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
export function SiderBar({ node }: { node: INode }) {
  const [open, setOpen] = useState(true);
  const [adding, setAdding] = useState(false);
  const setCurrentNode = useSetCurrentNode();
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
  const onSortEnd = useCallback(
    ({ oldIndex, newIndex }: { oldIndex: number; newIndex: number }) => {
      const newNode = {
        ...node,
        props: {
          ...node.props,
          children: arrayMove(node.props.children, oldIndex, newIndex),
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
  return (
    <Collapse
      orientation="horizontal"
      in={open}
      collapsedSize={"3rem"}
      className=" h-full pt-3 overflow-scroll relative"
    >
      <div className="absolute w-full h-full bg-gray-200 opacity-30 dark:bg-black top-0 left-0 border-r-2 border-gray-50"></div>
      <List
        className={`${styles.ulOverflow}`}
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
              <SortableList
                items={node.props.children}
                onSortEnd={onSortEnd}
                filterText={filterText}
                distance={1}
              />
            </React.Suspense>
          </>
        )}
        <SiderButton onClick={() => setOpen((o) => !o)}>
          <KeyboardArrowDown
            sx={{
              opacity: 1,
              transform: open ? "rotate(-270deg)" : "rotate(-90deg)",
              transition: "0.2s",
            }}
          />
        </SiderButton>
      </List>
    </Collapse>
  );
}
