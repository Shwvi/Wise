import { useRecoilValue } from "recoil";
import { DocNodeSelectState, DocNodeState } from "../ui/state/core";
import { getSnackbar } from "../ui/lib/globalMessage/index";
export function useCurrentNode() {
  const currentNodeId = useRecoilValue(DocNodeSelectState);
  const node = useRecoilValue(DocNodeState(currentNodeId));
  if (!node) {
    getSnackbar()?.(`Node id: '${currentNodeId}' can't be found`, {
      variant: "error",
    });
    return null;
  }
  return node;
}
