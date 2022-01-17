import {
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { INode, INodeIdentifier } from "@wise/common";
import React, { useCallback, useState } from "react";
import { dispatchNodeMap, useSubScribeNodeMap } from "../state/core/node";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { LoadingButton } from "@mui/lab";
import { completeNode } from "@/api/request";

export function PinCard({
  node,
  compl,
  unPin,
}: {
  node: INode;
  compl: (nodeId: INodeIdentifier) => Promise<void>;
  unPin: (nodeId: INodeIdentifier) => void;
}) {
  const [loading, setLoading] = useState(false);
  return (
    <div>
      <Card className="fade">
        <Card>
          <CardContent>
            <Typography
              variant="h6"
              // sx={{ fontSize: 14 }}
              color="text.secondary"
              gutterBottom
            >
              {node.props.name}
            </Typography>
            <Typography
              variant="body2"
              style={{ maxHeight: "20rem" }}
              className="overflow-x-auto"
            >
              <ReactMarkdown
                plugins={[remarkGfm]}
                className="markdown-body"
                components={{
                  a({ href, children }) {
                    const text = children?.[0] || "";

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
            </Typography>
          </CardContent>
          <CardActions>
            <LoadingButton
              size="small"
              variant="outlined"
              loading={loading}
              onClick={() => {
                setLoading(true);
                compl(node.nodeId).finally(() => {
                  setLoading(false);
                });
              }}
            >
              {node.props.isCompleted ? "Complete :)" : "Not Do YET :("}
            </LoadingButton>
            <LoadingButton
              size="small"
              onClick={() => {
                unPin(node.nodeId);
              }}
              // color="error"
              className="ml-2"
              variant="contained"
            >
              Un Pin
            </LoadingButton>
          </CardActions>
        </Card>
      </Card>
    </div>
  );
}
export function Pin() {
  const { value: nodeIds } = useSubScribeNodeMap();

  const compl = useCallback(async (nodeId: INodeIdentifier) => {
    const res = await completeNode(nodeId);
    if (res) {
      dispatchNodeMap((o) => {
        const idx = o.findIndex((n) => n.nodeId === nodeId);
        const node = o[idx];
        if (node) {
          const newNode = {
            ...node,
            props: { ...node.props, isCompleted: !node.props.isCompleted },
          };
          o.splice(idx, 1, newNode);
        }
        return [...o];
      });
    }
  }, []);
  const unPin = useCallback((nodeId: INodeIdentifier) => {
    dispatchNodeMap((o) => {
      const idx = o.findIndex((o) => o.nodeId === nodeId);
      if (idx !== -1) {
        o.splice(idx, 1);
      }
      return [...o];
    });
  }, []);
  return (
    <div className="w-full h-full p-8" style={{ minWidth: 400 }}>
      <Stack spacing={3}>
        {nodeIds.map((s) => (
          <PinCard node={s} key={s.nodeId} compl={compl} unPin={unPin} />
        ))}
      </Stack>
    </div>
  );
}
