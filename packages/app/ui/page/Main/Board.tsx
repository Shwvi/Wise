import React, { useCallback, useEffect, useRef, useState } from "react";
import { SiderBar } from "../../component/SiderBar";
import { useCurrentNode } from "../../../hook/useCurrentNode";
import { INode, RenderMarkDown } from "@wise/common";
import { useRecoilCallback, useRecoilValue } from "recoil";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";

import { modifyNode } from "../../../api/request";
import { DocNodeState, usePopPathStack } from "../../state/core";
import EditNode from "@/ui/component/EditNode";
import { useParams } from "react-router-dom";
import { pinNewNode } from "@/message/pinMain";
import { SetUserState } from "@/ui/state/core/user";
function ContentEditor({
  node,
  modifyNode,
}: {
  node: INode;
  modifyNode: (node: INode) => Promise<void>;
}) {
  const [edCon, setEdCon] = useState(false);
  const code = useRef("");
  const userInfo = useRecoilValue(SetUserState);
  useEffect(() => {
    code.current = node.props.content || "";
  }, [node]);
  return (
    <div className="h-full w-full p-3 overflow-auto">
      {edCon ? (
        <div className="mt-1 relative p-1 fade">
          <div className="absolute w-full h-full top-0 left-0 bg-blue-50 dark:bg-gray-900 opacity-70 rounded" />
          <CodeMirror
            autoFocus={true}
            theme={"dark"}
            onChange={(value) => {
              code.current = value;
            }}
            onBlur={() => {
              const newNode = {
                ...node,
                props: {
                  ...node.props,
                  content: code.current,
                },
              };
              modifyNode(newNode)
                .catch(() => {
                  code.current = node.props.content || "";
                })
                .finally(() => {
                  setEdCon(false);
                })
                .then(() => pinNewNode(newNode, userInfo!, true));
            }}
            value={node.props.content}
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
            ]}
          />
        </div>
      ) : (
        <div onClick={() => setEdCon((v) => !v)}>
          <RenderMarkDown node={node} />
        </div>
      )}
    </div>
  );
}
export function Board() {
  const { nodeId } = useParams<{ nodeId?: string }>();
  const node = useCurrentNode();
  const { pop } = usePopPathStack();
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
  useEffect(() => {
    if (nodeId && nodeId !== node?.nodeId) {
      pop(nodeId);
    }
  }, [node?.nodeId, nodeId, pop]);
  if (!node) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        No Node ID to start
      </div>
    );
  }
  return (
    <div className="w-full h-full flex flex-row relative">
      <EditNode />
      <SiderBar node={node} />

      <div className="flex-1 relative overflow-auto">
        <div
          className=" absolute w-full h-full top-0 left-0 bg-white opacity-30 dark:bg-gray-700 border-gray-800"
          style={{ zIndex: -1 }}
        ></div>
        <div className="w-full h-full">
          <ContentEditor node={node} modifyNode={changeNode} />
        </div>
      </div>
    </div>
  );
}
