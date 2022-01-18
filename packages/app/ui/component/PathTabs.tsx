import { INodeProps } from "@wise/common";
import { Tabs, Tab } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import {
  useRecoilState,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { DocNodeSelectState, PathStackSelector } from "../state/core/index";
export function PathTabs() {
  const history = useHistory();
  const [nodeId, setNodeId] = useRecoilState(DocNodeSelectState);
  const [realStack, setRealStack] = useState<
    {
      nodeId: string;
      props: Pick<INodeProps, "name">;
    }[]
  >([]);
  const setStack = useSetRecoilState(PathStackSelector);
  const stackLoadable = useRecoilValueLoadable(PathStackSelector);
  useEffect(() => {
    if (stackLoadable.state === "hasValue") {
      if (stackLoadable.contents.length == 0) {
        setStack([
          {
            nodeId: "0",
            props: {
              name: "/",
            },
          },
        ]);
        setRealStack([
          {
            nodeId: "0",
            props: {
              name: "/",
            },
          },
        ]);
      } else {
        setRealStack(stackLoadable.contents);
      }
    }
  }, [setStack, stackLoadable, stackLoadable.contents, stackLoadable.state]);

  const tabIndex = useMemo(() => {
    const idx = realStack.findIndex((n) => n.nodeId === nodeId);
    return idx === -1 ? 0 : idx;
  }, [nodeId, realStack]);
  const handleChange = useCallback(
    (_: React.SyntheticEvent, newValue: number) => {
      const target = realStack[newValue];
      history.push(`/node/${target.nodeId}`);
      setNodeId(target.nodeId);
    },
    [history, setNodeId, realStack]
  );

  return (
    <div className="w-full pb-1 overflow-hidden h-14 relative">
      <div className="absolute bg-gray-300 opacity-30 dark:bg-black top-0 left-0 w-full h-full dark:border-gray-50 border-b-2 "></div>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        {realStack.map((s) => (
          <Tab label={s.props.name} key={s.nodeId} />
        ))}
      </Tabs>
    </div>
  );
}
