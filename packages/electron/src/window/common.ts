import { RefreshWindowMessage } from "@wise/common";
import { BrowserWindow } from "electron";

export function registerCommonMessage({
  message,
  window,
}: {
  message: RefreshWindowMessage;
  window: BrowserWindow;
}) {
  if (message.type === "refreshWIndow") {
    window.reload();
  }
}
