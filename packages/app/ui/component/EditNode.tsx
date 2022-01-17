import {
  SpeedDial,
  SpeedDialIcon,
  SpeedDialAction,
  Box,
  Modal,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import DeleteForeverSharpIcon from "@mui/icons-material/DeleteForeverSharp";
import PushPinIcon from "@mui/icons-material/PushPin";
import DriveFileRenameOutlineIcon from "@mui/icons-material/DriveFileRenameOutline";
import FlagIcon from "@mui/icons-material/Flag";
import { useCurrentNode } from "@/hook/useCurrentNode";
import { completeNode, deleteNode, modifyNode } from "@/api/request";
import { useRecoilCallback } from "recoil";
import { DocNodeState, usePopPathStack } from "../state/core";
import { getSnackbar } from "../lib/globalMessage";
import { INode } from "@wise/common";
import { pinNewNode } from "@/message/pinMain";

export default function EditNode() {
  const node = useCurrentNode();
  const [open, setOpen] = React.useState(false);
  const [vis, setVis] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const pop = usePopPathStack();
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
        setOpen(false);
      }
    }
  }, [modify, node]);
  const rename = useCallback(
    (value: string, cb?: () => void) => {
      if (value.length > 25 || value.length === 0) {
        getSnackbar()?.(`The length of name should not be more than ${25}! `, {
          variant: "error",
        });
        return;
      }
      if (node) {
        changeNode({
          ...node,
          props: {
            ...node.props,
            name: value,
          },
        }).finally(cb);
      }
    },
    [changeNode, node]
  );

  if (!node) {
    return null;
  }
  return (
    <>
      <RenameModal
        open={vis}
        setOpen={setVis}
        value={node.props.name}
        rename={rename}
      />
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
          icon={<DeleteForeverSharpIcon />}
          tooltipTitle={node.props.isDeleted ? "UnDeleted" : "Delete"}
        />
        <SpeedDialAction
          key={"Pin"}
          icon={<PushPinIcon />}
          tooltipTitle={"Pin"}
          onClick={() => {
            pinNewNode(node)
              .then(() => {
                getSnackbar()?.(`Succeed pin`, { variant: "success" });
              })
              .catch((e) => {
                getSnackbar()?.(e.message || `Failed pin`, {
                  variant: "error",
                });
              })
              .finally(() => {
                setOpen(false);
              });
          }}
        />
        <SpeedDialAction
          onClick={() => setVis(true)}
          key={"Rename"}
          icon={<DriveFileRenameOutlineIcon />}
          tooltipTitle={"Rename"}
        />
        <SpeedDialAction
          onClick={complNode}
          key={"Complete"}
          icon={<FlagIcon />}
          tooltipTitle={node.props.isCompleted ? "Undo :(" : "Complete!"}
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
export function RenameModal({
  open,
  setOpen,
  value,
  rename,
}: {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  rename: (value: string, cb: () => void) => void;
  value: string;
}) {
  const [name, setName] = useState("");
  useEffect(() => {
    setName(value);
  }, [value]);
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style} className="dark:text-white text-black rounded">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Input New Name
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <TextField
            id="outlined-basic"
            label="New Name"
            variant="outlined"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          <Button
            variant="contained"
            onClick={() => rename(name, () => setOpen(false))}
          >
            Change
          </Button>
        </Typography>
      </Box>
    </Modal>
  );
}
