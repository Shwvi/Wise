import { INode } from "@wise/common";
import { generateSubScribe } from "@/hook";

export const { useSubScribe: useSubScribeNodeMap, dispatch: dispatchNodeMap } =
  generateSubScribe<INode[]>([]);
