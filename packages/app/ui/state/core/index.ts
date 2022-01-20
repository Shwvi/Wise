import { findNode } from "@/api/request";
import { useHistory } from "react-router-dom";
import {
  atom,
  atomFamily,
  selector,
  selectorFamily,
  useSetRecoilState,
} from "recoil";
import { INode, INodeIdentifier, INodeProps } from "@wise/common";
import { useCallback } from "react";

export const DocNodeState = atomFamily<INode, INodeIdentifier>({
  key: "DocNodeState",
  default: async (nodeId: INodeIdentifier) => {
    const node = await findNode(nodeId);
    if (node) {
      return node;
    }
    return {
      nodeId: "0",
      props: {
        children: [],
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
  const pop = useCallback(
    (id: INodeIdentifier) => {
      const parsedId = id.split("_");
      const len = parsedId.length;
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
          // len > s.length
          // maybe add middle node
          const newS: INodeIdentifier[] = ["0"];
          parsedId.reduce((p, c) => {
            const id = `${p}_${c}`;
            newS.push(id);
            return id;
          });
          return newS;
        }
      });
      history.push(`/node/${id}`);
      setNodeSelect(id);
    },
    [history, setNodeSelect, setStack]
  );
  return {
    pop,
  };
}

export const DocNodeSelectState = atom<INodeIdentifier>({
  key: "DocNodeSelectState",
  // root nodeId
  default: "0",
});
const WISEDEFAULTNODEID = "__WISE_DEFAULT_NODEID__";
export const DefaultNodeSelectState = atom<INodeIdentifier | null>({
  key: "DefaultNodeSelectState",
  default: localStorage.getItem(WISEDEFAULTNODEID) || null,
});
export const DefaultNodeSelector = selector<INodeIdentifier | null>({
  key: "DefaultNodeSelector",
  get: ({ get }) => {
    return get(DefaultNodeSelectState);
  },
  set: ({ set }, newValue) => {
    if (typeof newValue === "string")
      localStorage.setItem(WISEDEFAULTNODEID, newValue);
    set(DefaultNodeSelectState, newValue);
  },
});
export const removeDefaultNode = () =>
  localStorage.removeItem(WISEDEFAULTNODEID);

export const selectNodesFromIds = selectorFamily<INode[], INodeIdentifier[]>({
  key: "selectNodesFromIdsSelect",
  get:
    (nodeIds: INodeIdentifier[]) =>
    async ({ get }) => {
      const nodes = await Promise.all(
        nodeIds.map(async (id) => {
          const node = await get(DocNodeState(id));
          return node;
        })
      );
      return nodes;
    },
});
