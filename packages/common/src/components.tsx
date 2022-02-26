import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { INode } from ".";

export const RenderMarkDown = ({ node }: { node: INode }) => (
  <ReactMarkdown
    plugins={[remarkGfm]}
    className="markdown-body fade"
    components={{
      ol({ children, className }) {
        return <ol className={`${className} list-decimal`}>{children}</ol>;
      },
      ul({ children, className }) {
        return <ul className={`${className} list-disc`}>{children}</ul>;
      },
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
        const language = className ? className.replace("language-", "") : "";
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
);
