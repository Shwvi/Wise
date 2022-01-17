import { PinRes, PinWinCreateMessage } from "@wise/common";
import { BrowserWindow, MessageChannelMain, screen } from "electron";
import path from "path";
import { winMessageEmitter } from "../emitter";

const isDev = process.env.APPENV === "DEV";

export const createPinWindow = (initMessage?: PinWinCreateMessage) => {
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
      preload: path.join(__dirname, "../preload.js"),
    },
  });
  if (isDev) {
    win.webContents.openDevTools();
    win.loadURL("http://localhost:3001/");
  } else {
    const url = require("url").format({
      protocol: "file",
      slashes: true,
      pathname: require("path").join(__dirname, "../pin/dist/index.html"),
    });

    win.loadURL(url);
  }
  win.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
  const { port1, port2 } = new MessageChannelMain();
  winMessageEmitter.registerPin(port2.postMessage.bind(port2));
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
    }
  });
  port2.start();
  win.webContents.postMessage("main-world-port", null, [port1]);
};
