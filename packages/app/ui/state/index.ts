import { generateSubScribe } from "../../hook";

export const {
  useSubScribe: useSubScribeInitLoading,
  dispatch: dispatchInitLoading,
} = generateSubScribe<boolean>(true);
type NodeFilterState = "completed" | "uncompleted" | "deleted";
export const {
  useSubScribe: useSubScribeNodeFilterState,
  dispatch: dispatchNodeFilterState,
} = generateSubScribe<NodeFilterState[]>([
  "completed",
  "deleted",
  "uncompleted",
]);
