import { Button, Paper, TextField, Typography } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import KeyboardDoubleArrowLeftOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowLeftOutlined";
import KeyboardDoubleArrowRightOutlinedIcon from "@mui/icons-material/KeyboardDoubleArrowRightOutlined";
import LoadingButton from "@mui/lab/LoadingButton";

import { dispatchUser } from "../state/core/user";
import { signUp } from "@/api/request";

export function Sign() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const ref = useRef<HTMLButtonElement | null>(null);
  const trySignIn = useCallback(async () => {
    setLoading(true);
    const user = await signUp(username, password);
    if (user) {
      dispatchUser(user);
    }
    setLoading(false);
  }, [username, password]);
  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        ref.current?.click();
      }
    };
    document.addEventListener("keypress", listener);
    return () => document.removeEventListener("keypress", listener);
  }, []);
  return (
    <div className="w-full h-full  flex flex-col justify-center items-center">
      <Paper elevation={3} className=" w-96 h-80 p-3">
        <Typography
          variant="h6"
          component="div"
          className="text-gray-200 pt-2 pb-2"
        >
          Sign in for your wise life :)
        </Typography>

        <div className=" mt-4">
          <TextField
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
            }}
            id="input-with-sx"
            label="Username"
            className="w-full"
            variant="standard"
            placeholder="your cool name"
          />
        </div>
        <div className=" mt-4">
          <TextField
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
            type={"password"}
            id="input-with-sx"
            label="Password"
            className="w-full"
            variant="standard"
          />
        </div>
        <div className="mt-6">
          <LoadingButton
            ref={ref}
            variant="contained"
            className="w-full"
            onClick={trySignIn}
            loading={loading}
          >
            Sign In / Sign Up
          </LoadingButton>
        </div>
        <div className="mt-4 flex justify-end">
          <Button
            variant="text"
            className=" w-full"
            endIcon={<VpnKeyOutlinedIcon />}
          >
            Forget your password?
          </Button>
        </div>
      </Paper>
      <Paper elevation={3} className=" mt-4 w-96 h-14 p-3">
        <Button
          variant="text"
          className="w-full"
          startIcon={<KeyboardDoubleArrowLeftOutlinedIcon />}
          endIcon={<KeyboardDoubleArrowRightOutlinedIcon />}
        >
          About WISE and me
        </Button>
      </Paper>
    </div>
  );
}
