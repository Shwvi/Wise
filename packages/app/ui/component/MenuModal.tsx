import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { useRecoilState } from "recoil";
import { MenuModelOpenState } from "../state/ui/model";
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
};
export function MenuModal() {
  const [open, setOpen] = useRecoilState(MenuModelOpenState);
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style} className="dark:text-white text-black rounded">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
  );
}
