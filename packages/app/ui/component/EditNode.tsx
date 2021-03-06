import { SpeedDial, SpeedDialIcon, SpeedDialAction } from "@mui/material";
import React, { useCallback, useState } from "react";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import PushPinIcon from "@mui/icons-material/PushPin";
import FlagIcon from "@mui/icons-material/Flag";
import HomeIcon from "@mui/icons-material/Home";
import { useCurrentNode } from "@/hook/useCurrentNode";
import { completeNode, deleteNode, modifyNode } from "@/api/request";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import {
  DefaultNodeSelector,
  DocNodeState,
  usePopPathStack,
} from "../state/core";
import { getSnackbar } from "../lib/globalMessage";
import { INode } from "@wise/common";
import { pinNewNode } from "@/message/pinMain";
import { SetUserState } from "../state/core/user";
import { LoadingButton } from "@mui/lab";

export default function EditNode() {
  const node = useCurrentNode();
  const userInfo = useRecoilValue(SetUserState);
  const [open, setOpen] = useState(false);
  const [pining, setPining] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { pop } = usePopPathStack();
  const [defaultNodeId, setDefaultNodeId] = useRecoilState(DefaultNodeSelector);
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
  const removeNode = useCallback(
    async (nodeId: string) => {
      if (nodeId === "0") {
        getSnackbar()?.(`Can't delete the root node`, { variant: "error" });
        return;
      }
      const res = await deleteNode(nodeId);
      if (res) {
        const parsedId = nodeId.split("_");
        parsedId.pop();
        pop(parsedId.join("_"));
        delNode(nodeId);
      }
      setOpen(false);
    },
    [delNode, pop]
  );
  const modify = useRecoilCallback(
    ({ set }) =>
      (node: INode) => {
        set(DocNodeState(node.nodeId), node);
      },
    []
  );
  const changeNode = useCallback(
    async (node: INode) => {
      const res = await modifyNode(node);
      if (res) {
        modify(node);
      }
    },
    [modify]
  );
  const complNode = useCallback(async () => {
    if (node) {
      const res = await completeNode(node.nodeId);
      if (res) {
        modify({
          ...node,
          props: {
            ...node.props,
            isCompleted: !node.props.isCompleted,
          },
        });
      }
    }
  }, [modify, node]);

  if (!node || !userInfo) {
    return null;
  }
  return (
    <>
      <SpeedDial
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        ariaLabel="SpeedDial basic example"
        sx={{ position: "absolute", bottom: 16, right: 16 }}
        icon={<SpeedDialIcon />}
      >
        <SpeedDialAction
          onClick={() => removeNode(node.nodeId)}
          key={"Delete"}
          icon={
            <DeleteForeverSharpIcon
              color={node.props.isDeleted ? "inherit" : "error"}
            />
          }
          tooltipTitle={node.props.isDeleted ? "UnDeleted" : "Delete"}
        />
        <SpeedDialAction
          key={"Pin"}
          icon={
            pining ? <LoadingButton loading disableRipple /> : <PushPinIcon />
          }
          tooltipTitle={"Pin"}
          onClick={() => {
            setPining(true);
            pinNewNode(node, userInfo)
              .then(() => {
                getSnackbar()?.(`Successfully pin`, { variant: "success" });
              })
              .catch((e) => {
                getSnackbar()?.(e.message || `Failed pin`, {
                  variant: "error",
                });
              })
              .finally(() => {
                setPining(false);
              });
          }}
        />
        <SpeedDialAction
          onClick={complNode}
          key={"Complete"}
          icon={
            <FlagIcon color={node.props.isCompleted ? "success" : "inherit"} />
          }
          tooltipTitle={node.props.isCompleted ? "Undo :(" : "Complete!"}
        />
        <SpeedDialAction
          onClick={() => {
            setDefaultNodeId(node.nodeId);
          }}
          key={"Default"}
          icon={
            <HomeIcon
              color={node.nodeId === defaultNodeId ? "info" : "inherit"}
            />
          }
          tooltipTitle={
            node.nodeId === defaultNodeId ? "Default" : "Set as default"
          }
        />
      </SpeedDial>
    </>
  );
}
const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
