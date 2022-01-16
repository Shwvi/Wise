import { findNode } from "@/api/request";
import { useHistory } from "react-router-dom";
import { atom, atomFamily, selector, useSetRecoilState } from "recoil";
import { INode, INodeIdentifier, INodeProps } from "@wise/common";

export const DocNodeState = atomFamily<INode, INodeIdentifier>({
  key: "DocNodeState",
  default: async (nodeId: INodeIdentifier) => {
    const node = await findNode(nodeId);
    if (node) {
      return node;
    }
    return {
      nodeId: "0",
      children: [],
      props: {
        name: "error",
        content: "node not found",
      },
    };
  },
});

export const PathStackState = atom<INodeIdentifier[]>({
  key: "PathStackState",
  default: [],
});

export const PathStackSelector = selector<
  { nodeId: INodeIdentifier; props: Pick<INodeProps, "name"> }[]
>({
  key: "PathStackSelector",
  get: async ({ get }) => {
    const stack = get(PathStackState);
    const promises = stack.map(async (s) => {
      const node = await get(DocNodeState(s));
      return {
        nodeId: node.nodeId,
        props: {
          name: node.props.name,
        },
      };
    });
    const res = await Promise.all(promises);
    return res;
  },
  set: ({ set }, newValue) => {
    if (Array.isArray(newValue))
      set(
        PathStackState,
        newValue.map((n) => n.nodeId)
      );
  },
});

export function usePopPathStack() {
  const setStack = useSetRecoilState(PathStackState);
  const setNodeSelect = useSetRecoilState(DocNodeSelectState);
  const history = useHistory();
  return (id: INodeIdentifier) => {
    const len = id.split("_").length;
    setStack((s) => {
      if (s.length >= len) {
        if (s[len - 1] === id) {
          return [...s];
        }
        const newS = [];
        for (let i = 0; i < len - 1; i++) {
          newS.push(s[i]);
        }
        newS.push(id);
        return newS;
      } else {
        return [...s, id];
      }
    });
    history.push(`/node/${id}`);
    setNodeSelect(id);
  };
}

export const DocNodeSelectState = atom<INodeIdentifier>({
  key: "DocNodeSelectState",
  // root nodeId
  default: "0",
});
