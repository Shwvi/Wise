import { BrowserWindow, MessageChannelMain } from "electron";
import path from "path";
import { createPinWindow } from "./pin";

const isDev = process.env.APPENV === "DEV";

export const createMainWindow = () => {
  // createServer();
  const win = new BrowserWindow({
    width: 1000,
    height: 650,

    center: true,
    // closable: true,
    frame: false,
    // resizable: false,
    // titleBarStyle: "hidden",
    webPreferences: {
      preload: path.join(__dirname, "../preload.js"),
    },
  });
  win.webContents.on("new-window", function (e, url) {
    e.preventDefault();
    require("electron").shell.openExternal(url);
  });
  if (isDev) win.loadURL("http://localhost:3000/");
  else {
    const url = require("url").format({
      protocol: "file",
      slashes: true,
      pathname: require("path").join(__dirname, "../../../app/dist/index.html"),
    });

    win.loadURL(url);
  }
  win.webContents.openDevTools();
  const { port1, port2 } = new MessageChannelMain();
  port2.postMessage("ARO_MAIN_CHANNEL");
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
        createPinWindow();
        win.close();
        return;
      }
    }
  });
  port2.start();
  win.webContents.postMessage("main-world-port", null, [port1]);
};
