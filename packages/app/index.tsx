import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Redirect, Route } from "react-router-dom";
import { render } from "react-dom";
import { useSnackbar, SnackbarProvider } from "notistack";

import { Main, pageTransitions } from "./ui/page/Main";
import "./index.css";

import { dispatchInitLoading, useSubScribeInitLoading } from "./ui/state";
import { setSpeech } from "./ui/lib/speech";
import { lifeCycler } from "./ui/lib/lifecycle/emitter";
import { MessageChannelBuild } from "./message";
import { bindSnackbar } from "./ui/lib/globalMessage";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { dispatchDark } from "./ui/state/dark";
import { MainHeader } from "./ui/component/MainHeader";
import { RecoilRoot, useRecoilState, useRecoilValue } from "recoil";
import { SetUserState, UserState } from "./ui/state/core/user";
import { Sign } from "./ui/page/Sign";
import { HomeFallBack } from "./ui/component/Fallbacks";
import { MenuModal } from "./ui/component/MenuModal";
import { getUserInfo, patchToken } from "./api/request";
import { AnimatedSwitch } from "react-router-transition";
import { UserPage } from "./ui/page/User";

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
  const [userInfo, setUserInfo] = useRecoilState(SetUserState);
  useEffect(() => {
    if (!userInfo)
      getUserInfo().then((user) => {
        if (user) {
          patchToken(user.token);
          setUserInfo(user);
        }
      });
  }, [setUserInfo, userInfo]);

  return (
    <AnimatedSwitch
      {...pageTransitions}
      mapStyles={(styles) => ({
        transform: `translateX(${styles.offset}%)`,
        height: "100%",
        width: "100%",
      })}
      className="switch-wrapper w-full h-full"
    >
      <Route path={"/sign"}>
        {userInfo ? <Redirect to="/node" /> : <Sign />}
      </Route>
      <Route path={"/user"}>
        {userInfo ? <UserPage /> : <Redirect to="/sign" />}
      </Route>
      <Route path={"/node"}>
        {userInfo ? <Main /> : <Redirect to="/sign" />}
      </Route>
      <Route>
        {userInfo ? <Redirect to="/node" /> : <Redirect to="/sign" />}
      </Route>
    </AnimatedSwitch>
  );
};
const App = () => {
  const { value: loading } = useSubScribeInitLoading();
  useEffect(() => {
    lifeCycler.registerStart(setSpeech);
    lifeCycler.registerStart(MessageChannelBuild);
    lifeCycler.start().then(() => {
      dispatchInitLoading(false);
    });
  }, []);
  return (
    <Router>
      <div className="w-screen h-screen dark:bg-gray-700 text-white relative bg-gradient dyn-bg">
        <div className="w-full h-full flex flex-col">
          <MenuModal />
          <React.Suspense fallback={<HomeFallBack />}>
            <div>
              <MainHeader />
            </div>
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

render(<ThemeWrapper />, document.getElementById("root"));
