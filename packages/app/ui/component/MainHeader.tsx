import {
  Box,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Avatar,
  styled,
  Badge,
  Popover,
  Stack,
} from "@mui/material";
import React, { useCallback } from "react";
import MenuIcon from "@mui/icons-material/Menu";
import { useRecoilValue, useSetRecoilState } from "recoil";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";

import styles from "./mainheader.less";
import { SetUserState } from "../state/core/user";
import { useLoginOut } from "@/api/request";
import { MenuModelOpenState } from "../state/ui/model";
import { sendMessageToMainProcess } from "@/message";
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));
export function MainHeader() {
  const userInfo = useRecoilValue(SetUserState);
  const loginOut = useLoginOut();
  const setMenuModalOpenState = useSetRecoilState(MenuModelOpenState);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget);
    },
    []
  );

  const handleClose = useCallback(() => {
    setAnchorEl(null);
  }, []);

  const open = Boolean(anchorEl);
  return (
    <Box sx={{ flexGrow: 1 }} className={`${styles.drag}`}>
      <AppBar position="static">
        <Toolbar variant="dense">
          <IconButton
            onClick={() => setMenuModalOpenState(true)}
            size="medium"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              font: "italic small-caps bold 20px/2 cursive;",
              letterSpacing: ".3rem",
            }}
          >
            Wise
          </Typography>

          <Popover
            open={open}
            anchorEl={anchorEl}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            onClick={() => handleClose()}
          >
            <Box className="pt-1 pb-1">
              <Stack spacing={1}>
                <Button
                  color="inherit"
                  // onClick={loginOut}
                  className="w-full text-justify"
                  endIcon={<SettingsIcon />}
                >
                  <span className="text-justify w-full">User Setting</span>
                </Button>
                <Button
                  color="inherit"
                  onClick={loginOut}
                  className="w-full"
                  endIcon={<LogoutIcon />}
                >
                  <span className="text-justify w-full">Login Out</span>
                </Button>
                <Button
                  color="error"
                  onClick={() => {
                    sendMessageToMainProcess({ type: "window-close" });
                  }}
                  className="w-full"
                  endIcon={<CloseRoundedIcon />}
                >
                  <span className="text-justify w-full">Close </span>
                </Button>
              </Stack>
            </Box>
          </Popover>
          {userInfo && (
            <IconButton onClick={handleClick}>
              <StyledBadge
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                variant="dot"
              >
                <Avatar
                  alt={userInfo.username}
                  src={userInfo.props.avatar}
                  sx={{ width: 28, height: 28 }}
                />
              </StyledBadge>
            </IconButton>
          )}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
