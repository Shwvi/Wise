import { PinRes, PinWinCreateMessage } from "@wise/common";
import { BrowserWindow, ipcMain, MessageChannelMain, screen } from "electron";
import path from "path";
import { winMessageEmitter } from "../../emitter";
import { registerCommonMessage } from "../common";
import { BSMessageListener } from "./BSMessage";

const isDev = process.env.APPENV === "DEV";
// TODO: reject ?
export const createPinWindow = (initMessage?: PinWinCreateMessage) => {
  return new Promise((resolve) => {
    const screens = screen.getAllDisplays();
    const win = new BrowserWindow({
      width: 400,
      height: screens[0].workArea.height,
      // closable: true,
      // frame: false,
      transparent: true,
      resizable: true,
      titleBarStyle: "hidden",
      x: screens[0].workArea.width - 400,
      y: 0,
      alwaysOnTop: true,
      webPreferences: {
        preload: path.join(__dirname, "../../preload.js"),
      },
    });
    if (isDev) {
      win.webContents.openDevTools();
      win.loadURL("http://localhost:3001/");
    } else {
      const url = require("url").format({
        protocol: "file",
        slashes: true,
        pathname: require("path").join(__dirname, "../../pin/dist/index.html"),
      });

      win.loadURL(url);
    }
    win.webContents.on("new-window", function (e, url) {
      e.preventDefault();
      require("electron").shell.openExternal(url);
    });
    ipcMain.on("request-worker-channel", (event) => {
      if (win.isDestroyed()) return;
      if (event.senderFrame === win.webContents.mainFrame) {
        // the follow should only be triggered once.
        resolve("Created");
        const { port1, port2 } = new MessageChannelMain();
        winMessageEmitter.registerPin(port2.postMessage.bind(port2), win);
        win.webContents.postMessage("main-world-port", null, [port1]);
        port2.postMessage(initMessage || "Error no user info get");
        port2.on("message", (event) => {
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
            if ((message as PinRes).type === "PinRes") {
              winMessageEmitter.emitMain({
                key,
                message,
              });
            }
            registerCommonMessage({
              message,
              window: win,
              port2,
              BSMessageListener,
            });
          }
        });
        port2.start();
      }
    });
  });
};
