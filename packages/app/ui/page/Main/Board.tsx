import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { SiderBar } from "../../component/SiderBar";
import { useCurrentNode } from "../../../hook/useCurrentNode";
import { INode } from "@wise/common";
import { useRecoilCallback } from "recoil";
import CodeMirror from "@uiw/react-codemirror";
import { markdown, markdownLanguage } from "@codemirror/lang-markdown";
import { languages } from "@codemirror/language-data";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";

import { modifyNode } from "../../../api/request";
import { DocNodeState } from "../../state/core";
import EditNode from "@/ui/component/EditNode";
function ContentEditor({
  node,
  modifyNode,
}: {
  node: INode;
  modifyNode: (node: INode) => Promise<void>;
}) {
  const [edCon, setEdCon] = useState(false);
  const code = useRef("");
  useEffect(() => {
    if (node.props.content) code.current = node.props.content;
  }, [node.props.content]);
  return (
    <div className="h-full w-full p-3 overflow-auto">
      {/* <Divider />
      <div>
        {edTit ? (
          <TextareaAutosize
            className=" w-full border-none outline-none"
            defaultValue={node.props.name}
            onFocus={function (e) {
              const val = e.target.value;
              e.target.value = "";
              e.target.value = val;
            }}
            ref={(r) => {
              r?.focus();
            }}
            onBlur={(e) => {
              const { value } = e.target;
              if (value.length > 25) {
                getSnackbar()?.(
                  `The length of name should not be more than ${25}! `,
                  { variant: "error" }
                );
                setEdTit(false);
                return;
              }
              modifyNode({
                ...node,
                props: {
                  ...node.props,
                  name: e.target.value,
                },
              }).finally(() => {
                setEdTit(false);
              });
            }}
          />
        ) : (
          <div onClick={() => setEdTit(true)}>{node.props.name}</div>
        )}
      </div>
      <div className="mt-4" />
      <Divider /> */}
      {edCon ? (
        <div className="mt-1 relative p-1">
          <div className="absolute w-full h-full top-0 left-0 bg-blue-50 dark:bg-gray-900 opacity-70 rounded" />
          <CodeMirror
            autoFocus={true}
            theme={"dark"}
            onChange={(value) => {
              code.current = value;
            }}
            onBlur={() => {
              modifyNode({
                ...node,
                props: {
                  ...node.props,
                  content: code.current,
                },
              })
                .catch(() => {
                  code.current = node.props.content || "";
                })
                .finally(() => {
                  setEdCon(false);
                });
            }}
            value={node.props.content}
            extensions={[
              markdown({ base: markdownLanguage, codeLanguages: languages }),
            ]}
          />
        </div>
      ) : (
        <div onClick={() => setEdCon((v) => !v)}>
          <ReactMarkdown
            plugins={[remarkGfm]}
            className="markdown-body"
            components={{
              a({ href, children }) {
                const text = children[0];

                return (
                  // eslint-disable-next-line react/jsx-no-target-blank
                  <a href={href} target="_blank">
                    {text}
                  </a>
                );
              },
              code({ className, children }) {
                // Removing "language-" because React-Markdown already added "language-"
                const language = className
                  ? className.replace("language-", "")
                  : "";
                return (
                  <SyntaxHighlighter
                    style={materialDark}
                    language={language}
                    // eslint-disable-next-line react/no-children-prop
                    children={children[0]}
                  />
                );
              },
            }}
          >
            {node.props.content || "*Empty*"}
          </ReactMarkdown>
        </div>
      )}
    </div>
  );
}
export function Board() {
  const node = useCurrentNode();
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
