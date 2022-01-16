import React, { useCallback, useRef, useState } from "react";
import { RenderSplitterProps, Split } from "@geoffcox/react-splitter";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import BorderColorIcon from "@mui/icons-material/BorderColor";
import { SiderBar } from "../../component/SiderBar";
import { useCurrentNode } from "../../../hook/useCurrentNode";
import { INode } from "@wise/common";
import { Button, Divider, IconButton, TextareaAutosize } from "@mui/material";
import { useRecoilCallback } from "recoil";
import CloseIcon from "@mui/icons-material/Close";
import { modifyNode } from "../../../api/request";
import { getSnackbar } from "../../lib/globalMessage";
import { DocNodeState } from "../../state/core";

const renderSplitter = (props: RenderSplitterProps) => {
  return (
    <div className="bg-gray-50 w-full h-full transition-all duration-300 ease-in-out hover:bg-gray-400"></div>
  );
};
function ContentEditor({
  node,
  modifyNode,
}: {
  node: INode;
  modifyNode: (node: INode) => Promise<void>;
}) {
  const [edTit, setEdTit] = useState(false);
  const [edCon, setEdCon] = useState(false);

  return (
    <div className="h-full w-full p-3">
      <div className="flex">
        <span className="text-gray-100 flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
          Title
        </span>
        <IconButton
          size="small"
          color="primary"
          onClick={() => setEdTit((v) => !v)}
        >
          {edTit ? (
            <CloseIcon fontSize="inherit" color="error" />
          ) : (
            <BorderColorIcon fontSize="inherit" />
          )}
        </IconButton>
      </div>
      <Divider />
      <div>
        {edTit ? (
          <TextareaAutosize
            className=" w-full h-full border-none outline-none"
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
      <div className="flex mt-5">
        <span className="text-gray-100 flex-1 overflow-hidden whitespace-nowrap overflow-ellipsis">
          Content
        </span>
        <IconButton
          size="small"
          color="primary"
          onClick={() => setEdCon((c) => !c)}
        >
          {edCon ? (
            <CloseIcon fontSize="inherit" color="error" />
          ) : (
            <BorderColorIcon fontSize="inherit" />
          )}
        </IconButton>
      </div>
      <Divider />
      {edCon ? (
        <TextareaAutosize
          className=" w-full h-full border-none outline-none"
          defaultValue={node.props.content}
          onFocus={function (e) {
            const val = e.target.value;
            e.target.value = "";
            e.target.value = val;
          }}
          ref={(r) => {
            r?.focus();
          }}
          onBlur={(e) => {
            modifyNode({
              ...node,
              props: {
                ...node.props,
                content: e.target.value,
              },
            }).finally(() => {
              setEdCon(false);
            });
          }}
        />
      ) : (
        <div onClick={() => setEdCon((v) => !v)}>
          <ReactMarkdown plugins={[remarkGfm]}>
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
    <div className="w-full h-full flex flex-row">
      <SiderBar node={node} />

      <div className="flex-1 relative">
        <div
          className=" absolute w-full h-full top-0 left-0 bg-white opacity-30 dark:bg-gray-700 border-gray-800"
          style={{ zIndex: -1 }}
        ></div>
        <Split
          renderSplitter={renderSplitter}
          horizontal
          splitterSize="2px"
          initialPrimarySize="70%"
        >
          <div className="w-full h-full">
            <ContentEditor node={node} modifyNode={changeNode} />
          </div>
          <div></div>
        </Split>
      </div>
    </div>
  );
}
