import { v4 as uuid } from "uuid";
import { EventEmitter } from "events";
import { log } from "../log";
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
      messageEmitter.emit(key, message);
      messageEmitter.removeAllListeners(key);
    });
    channels.mainProcess.onmessage = () => {
      // onmessage should be initialized so that
      // listener should work
    };
  } else {
    log("Main process port doesn't exist", "Message", "error");
  }
}
export function sendMessageToMainProcess<P, R>(message: P) {
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
