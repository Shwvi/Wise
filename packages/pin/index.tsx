import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { render } from "react-dom";
import { useSnackbar, SnackbarProvider } from "notistack";

import "./index.css";

import { dispatchInitLoading, useSubScribeInitLoading } from "./ui/state";
import { setSpeech } from "./ui/lib/speech";
import { lifeCycler } from "./ui/lib/lifecycle/emitter";
import { MessageChannelBuild } from "./message";
import { bindSnackbar, getSnackbar } from "./ui/lib/globalMessage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { dispatchDark } from "./ui/state/dark";
import { RecoilRoot } from "recoil";
import { useSubScribeUser } from "./ui/state/core/user";
import { Sign } from "./ui/page/Sign";
import { HomeFallBack } from "./ui/component/Fallbacks";
import { Pin } from "./ui/page/Pin";
import { IconButton } from "@mui/material";
import { PushPin, PushPinOutlined } from "@mui/icons-material";
import { sendAlwaysTop } from "./message/alwaysTop";
import { ErrorBoundary } from "./ui/component/ErrorBoundary";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1976d2",
    },
  },
});
const lightTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2d6198",
    },
  },
});
function AppGlobalEffect() {
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    bindSnackbar(enqueueSnackbar);
  }, [enqueueSnackbar]);
  return null;
}
const LoginOrMain = () => {
  const userInfo = useSubScribeUser();
  return (
    <Switch>
      <Route path={"/sign"}>
        {userInfo ? <Redirect to="/pin" /> : <Sign />}
      </Route>
      <Route path={"/pin"}>
        {userInfo ? <Pin /> : <Redirect to="/sign" />}
      </Route>
      <Route>
        {userInfo ? <Redirect to="/pin" /> : <Redirect to="/sign" />}
      </Route>
    </Switch>
  );
};
const App = () => {
  const { value: loading } = useSubScribeInitLoading();
  const [pin, setPin] = useState(true);
  useEffect(() => {
    lifeCycler.registerStart(setSpeech);
    lifeCycler.registerStart(MessageChannelBuild);
    lifeCycler.start().then(() => {
      dispatchInitLoading(false);
    });
  }, []);

  return (
    <Router>
      <div className="w-screen h-screen text-white relative bg-gradient dyn-bg">
        <div className="absolute top-2 right-2">
          <IconButton
            onClick={() => {
              sendAlwaysTop(!pin)
                .then((d) => {
                  getSnackbar()?.(`AlwaysTop now is ${d}`, {
                    variant: "success",
                  });
                  setPin(d);
                })
                .catch(() => {
                  getSnackbar()?.(
                    "Oops, failed to change the alwaysTop state, please try restart app.",
                    { variant: "error" }
                  );
                });
            }}
          >
            {pin ? (
              <PushPin className="transform rotate-45" />
            ) : (
              <PushPinOutlined />
            )}
          </IconButton>
        </div>
        <div className="w-full h-full flex flex-col overflow-scroll">
          <React.Suspense fallback={<HomeFallBack />}>
            <div className="flex-1">
              {loading ? <HomeFallBack /> : <LoginOrMain />}
            </div>
          </React.Suspense>
        </div>
      </div>
    </Router>
  );
};
function ThemeWrapper() {
  const [theme, setTheme] = useState(lightTheme);
  useEffect(() => {
    const darkMode = window.matchMedia("(prefers-color-scheme: dark)");
    if (darkMode.matches) {
      dispatchDark("dark");
      setTheme(darkTheme);
    }
    const onThemeChange = (e: MediaQueryListEvent) => {
      const newColorScheme = e.matches ? "dark" : "light";
      dispatchDark(newColorScheme);
      setTheme(newColorScheme === "dark" ? darkTheme : lightTheme);
    };
    darkMode.addEventListener("change", onThemeChange);
    return () => {
      darkMode.removeEventListener("change", onThemeChange);
    };
  }, []);
  return (
    <RecoilRoot>
      <SnackbarProvider maxSnack={5}>
        <ThemeProvider theme={theme}>
          <App />
          <AppGlobalEffect />
        </ThemeProvider>
      </SnackbarProvider>
    </RecoilRoot>
  );
}

render(
  <ErrorBoundary>
    <ThemeWrapper />
  </ErrorBoundary>,
  document.getElementById("root")
);
