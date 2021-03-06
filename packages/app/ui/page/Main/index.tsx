import React from "react";
import { AnimatedSwitch, spring } from "react-router-transition";
import { Redirect, Route } from "react-router-dom";
import { PathTabs } from "../../component/PathTabs";
import { Board } from "./Board";
import { FallBack } from "../../component/Fallbacks";
import { useRecoilValue } from "recoil";
import { DefaultNodeSelector } from "@/ui/state/core";

function glide(val: number) {
  return spring(val, {
    stiffness: 174,
    damping: 24,
  });
}
export const pageTransitions = {
  atEnter: {
    opacity: 0,
    offset: 100,
  },
  atLeave: {
    opacity: 0,
    offset: glide(-100),
  },
  atActive: {
    opacity: 1,
    offset: glide(0),
  },
};
export function Main() {
  const defaultNodeId = useRecoilValue(DefaultNodeSelector);
  return (
    <div className="h-full flex flex-col">
      <PathTabs />
      <AnimatedSwitch
        {...pageTransitions}
        mapStyles={(styles) => ({
          transform: `translateX(${styles.offset}%)`,
          height: "100%",
          width: "100%",
        })}
        className="switch-wrapper flex-1"
      >
        <Route path={"/node/:nodeId"}>
          <React.Suspense fallback={<FallBack />}>
            <Board />
          </React.Suspense>
        </Route>
        <Route>
          <Redirect to={`/node/${defaultNodeId || "0"}`} />
        </Route>
      </AnimatedSwitch>
    </div>
  );
}
