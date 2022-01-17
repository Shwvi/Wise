import { Box, Modal, Typography } from "@mui/material";
import React from "react";
import { useRecoilState } from "recoil";
import { MenuModelOpenState } from "../state/ui/model";
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
export function MenuModal() {
  const [open, setOpen] = useRecoilState(MenuModelOpenState);
  return (
    <Modal open={open} onClose={() => setOpen(false)}>
      <Box sx={style} className="dark:text-white text-black rounded">
        <Typography variant="h5">Wise about.</Typography>
        <br />
        <Typography variant="body2">
          Wise is an app aiming for user to work and leran effectively.
          <br />
          <br />
          In the meantime, it is completly free and open-source.
          <br />
          <br />
          If you really appreciate my hard and selfless working, you could buy
          me a coffe :)
          <br />
          <br />
          Or you are expected to prefect the app on the <a>Github</a>
          <br />
          <br />
        </Typography>
      </Box>
    </Modal>
  );
}
