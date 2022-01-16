import { generateSubScribe } from "../../hook";

export const {
  useSubScribe: useSubScribeInitLoading,
  dispatch: dispatchInitLoading,
} = generateSubScribe<boolean>(true);
