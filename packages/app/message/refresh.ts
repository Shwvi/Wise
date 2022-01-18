import { RefreshWindowMessage } from "@/../common/dist";
import { sendMessageToMainProcess } from ".";

export function RefreshWindow_noneres() {
  sendMessageToMainProcess({ type: "refreshWIndow" } as RefreshWindowMessage);
}
