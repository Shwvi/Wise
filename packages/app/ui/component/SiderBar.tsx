import { KeyboardArrowDown } from "@mui/icons-material";
import { Button, Collapse, Divider, List, ListItemButton } from "@mui/material";
import React, { ReactNode, useCallback, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import styles from "./siderbar.less";
import { DocNodeState, usePopPathStack } from "../state/core";
import { createNode, deleteNode } from "../../api/request";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { FallBack } from "./Fallbacks";
import { INode } from "@wise/common";
import { LoadingButton } from "@mui/lab";
function DocNodeButton({
  nodeId,
  removeNode,
}: {
  nodeId: string;
  removeNode: (nodeId: string) => Promise<void>;
}) {
  const node = useRecoilValue(DocNodeState(nodeId));
  const pop = usePopPathStack();
  return (
    <SiderButton onClick={() => pop(node.nodeId)}>
      <span
        className={`${node.props.isDeleted ? "text-red-500 line-through" : ""}`}
      >
        {node.props.name}
      </span>
      <Button
        color={node.props.isDeleted ? undefined : "error"}
        onClick={() => removeNode(nodeId)}
      >
        {node.props.isDeleted ? "Undel" : "Del"}
      </Button>
    </SiderButton>
  );
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
  const delNode = useRecoilCallback(
    ({ set }) =>
      (nodeId: string) => {
        set(DocNodeState(nodeId), (o) => ({
          ...o,
          props: {
            ...o.props,
            isDeleted: !o.props.isDeleted,
          },
        }));
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
  const removeNode = useCallback(
    async (nodeId: string) => {
      const res = await deleteNode(nodeId);
      if (res) {
        delNode(nodeId);
      }
    },
    [delNode]
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
            <div className="w-full flex">
              <LoadingButton onClick={addNode} loading={adding}>
                <AddIcon />
              </LoadingButton>
            </div>
            <React.Suspense fallback={<FallBack coverclassname="-none" />}>
              {node.children.map((n, i) => (
                <DocNodeButton key={i} nodeId={n} removeNode={removeNode} />
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
