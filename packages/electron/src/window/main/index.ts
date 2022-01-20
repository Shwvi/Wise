import { BrowserWindow, ipcMain, MessageChannelMain } from "electron";
import path from "path";
import { PinMessage, PinWinCreateMessage, sleep } from "@wise/common";
import { createPinWindow } from "../pin";
import { winMessageEmitter } from "../../emitter";
import { registerCommonMessage } from "../common";
import { BSMessageListener } from "./BSMessage";

const isDev = process.env.APPENV === "DEV";

export const createMainWindow = () => {
  if (winMessageEmitter.mainWin && !winMessageEmitter.mainWin.isDestroyed()) {
    return;
  }
  const win = new BrowserWindow({
    width: 1000,
    height: 650,

    center: true,
    // closable: true,
    // frame: false,
    // resizable: false,
    titleBarStyle: "hidden",
    trafficLightPosition: {
      x: 10,
      y: 15,
    },
    webPreferences: {
      preload: path.join(__dirname, "../../preload.js"),
    },
  });

  win.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
  const loadWin = () => {
    if (isDev) {
      win.webContents.openDevTools();
      win.loadURL("http://localhost:3000/");
    } else {
      const url = require("url").format({
        protocol: "file",
        slashes: true,
        pathname: require("path").join(__dirname, "../../app/dist/index.html"),
      });

      win.loadURL(url);
    }
  };
  loadWin();
  ipcMain.on("request-worker-channel", (event) => {
    if (win.isDestroyed()) return;
    if (event.senderFrame === win.webContents.mainFrame) {
      const { port1, port2 } = new MessageChannelMain();
      winMessageEmitter.registerMain(port2.postMessage.bind(port2), win);
      win.webContents.postMessage("main-world-port", null, [port1]);
      port2.start();
      port2.on("message", async (event) => {
        const { data } = event;
        const { key, message } = data;
        if (key && message) {
          if (message.type === "ARO-Change-Top") {
            win.setAlwaysOnTop(message.data);
            port2.postMessage({ key, message: message.data });
            return;
          }
          if (message.type === "window-close") {
            win.close();
            return;
          }
          if ((message as PinMessage).type === "Pin") {
            if (
              !winMessageEmitter.pinWin ||
              winMessageEmitter.pinWin.isDestroyed()
            ) {
              await createPinWindow({
                type: "PinCreate",
                data: message.extra,
              } as PinWinCreateMessage); // "Created"
            }
            // sleep here for pin to be ready
            // the more elegent solution is
            // to build a message channel and
            // only send to pin window when it's ready
            await sleep(1000);
            winMessageEmitter.emitPin({
              key,
              message,
            });
          }
          if ((message as PinWinCreateMessage).type === "PinCreate") {
            await createPinWindow(message); // "Created"
            port2.postMessage({ key, message: true });
            return;
          }
          if (message.type === "refreshWIndow") {
            loadWin();
          }
          registerCommonMessage({
            message,
            window: win,
            port2,
            BSMessageListener,
          });
        }
      });
    }
  });
};
