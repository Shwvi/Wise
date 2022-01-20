import { RefreshWindowMessage, IBSMessage } from "@wise/common";
import { BrowserWindow } from "electron";

export function registerCommonMessage({
  message,
  window,
  port2,
}: {
  message: RefreshWindowMessage | IBSMessage;
  window: BrowserWindow;
  port2: Electron.MessagePortMain;
  BSMessageListener: ({ message }: Pick<IBSMessage, "message">) => Promise<any>;
}) {
  if (message.type === "IBSMessage") {
    //IBSMessage
  }
  if (message.type === "refreshWIndow") {
    window.reload();
  }
}
