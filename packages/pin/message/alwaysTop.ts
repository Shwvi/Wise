import { PinWinAlwaysTop } from "@wise/common";
import { sendMessageToMainProcess } from ".";

export function sendAlwaysTop(state: boolean) {
  return sendMessageToMainProcess<boolean>({
    type: "ARO-Change-Top",
    data: state,
  } as PinWinAlwaysTop);
}
