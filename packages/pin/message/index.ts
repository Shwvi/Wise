import { v4 as uuid } from "uuid";
import { EventEmitter } from "events";
import { log } from "../log";
import { PinMessage, PinRes, PinWinCreateMessage } from "@wise/common";
import { dispatchUser } from "@/ui/state/core/user";
import { dispatchNodeMap } from "@/ui/state/core/node";
const messageEmitter = new EventEmitter();
const channels: {
  mainProcess: MessagePort | null;
} = {
  mainProcess: null,
};
function registerChannels(type: keyof typeof channels, port: MessagePort) {
  channels[type] = port;
}
function initMainProcessMessageListener() {
  if (channels.mainProcess) {
    channels.mainProcess.addEventListener("message", (e) => {
      log(e.data, "MainProcess", "success");
      const { data } = e;
      const { key, message } = data;
      if ((e.data as PinWinCreateMessage)?.type === "PinCreate") {
        const { data } = e.data as PinWinCreateMessage;
        dispatchUser(data);
      }
      messageEmitter.emit(key, message);
      messageEmitter.removeAllListeners(key);
      if ((message as PinMessage)?.type === "Pin") {
        const node = message.data;
        dispatchNodeMap((o) => {
          const idx = o.findIndex((o) => o.nodeId === node.nodeId);
          if (idx !== -1) {
            o.splice(idx, 1, node);
            return [...o];
          }
          return [...o, node];
        });
        channels.mainProcess?.postMessage({
          key,
          message: {
            type: "PinRes",
            data: true,
          } as PinRes,
        });
      }
    });
    channels.mainProcess.onmessage = (event) => {
      // onmessage should be initialized so that
      // listener should work
    };
  } else {
    log("Main process port doesn't exist", "Message", "error");
  }
}
export function sendMessageToMainProcess<R>(message: {
  type: string;
  data?: any;
}) {
  return new Promise<R>((resolve, reject) => {
    const key = uuid();
    const { mainProcess } = channels;
    if (mainProcess) {
      mainProcess.postMessage({
        key,
        message,
      });
      messageEmitter.addListener(key, (data: R) => {
        resolve(data);
      });
      setTimeout(reject, 5000);
    } else {
      reject(new Error("Main process port doesn' exist."));
    }
  });
}
export function MessageChannelBuild() {
  return new Promise((resolve) => {
    window.onmessage = (event) => {
      // event.source === window means the message is coming from the preload
      // script, as opposed to from an <iframe> or other source.
      if (event.source === window && event.data === "main-world-port") {
        const [port] = event.ports;
        // Once we have the port, we can communicate directly with the main
        // process.
        registerChannels("mainProcess", port);
        initMainProcessMessageListener();
        resolve("message channel");
      }
    };
  });
}
