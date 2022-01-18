import { KeyboardArrowDown } from "@mui/icons-material";
import {
  Button,
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
import styles from "./siderbar.less";
import { DocNodeState, usePopPathStack } from "../state/core";
import { createNode, deleteNode } from "../../api/request";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { FallBack } from "./Fallbacks";
import { INode } from "@wise/common";

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
  const setNewNode = useRecoilCallback(
    ({ set }) =>
      (node: INode) => {
        set(DocNodeState(node.nodeId), node);
      },
    []
  );
  const addNode = useCallback(async () => {
    setAdding(true);
    const { children, nodeId } = node;
    const newId = nodeId + `_${children.length}`;
    const newNode = {
      nodeId: newId,
      children: [],
      props: {
        name: "untitled",
      },
    };
    const res = await createNode(newNode);
    if (res) {
      setNewNode(newNode);
      setNewNode({
        ...node,
        children: [...node.children, newNode.nodeId],
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
              {node.children.map((n, i) => (
                <DocNodeButton key={i} nodeId={n} filterText={filterText} />
              ))}
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
