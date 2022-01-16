// const { logger } = require("./log");

import { app, BrowserWindow, protocol } from "electron";
import path from "path";
import fs from "fs";

import { createMainWindow } from "./window/main";
import { createPinWindow } from "./window/pin";

const isDev = process.env.APPENV === "DEV";
const indexFile = "index.html";

app
  .whenReady()
  .then(() => {
    protocol.interceptFileProtocol("file", (request, callback) => {
      const url = request.url.substr(7); // strip "file://" out of all urls
      if (request.url.endsWith(indexFile)) {
        callback({ path: url });
      } else {
        const realPath = path.join(__dirname, "../../app/dist", url);
        if (fs.existsSync(realPath)) {
          callback({ path: path.join(__dirname, "../../app/dist", url) });
        } else {
          callback({
            path: path.join(__dirname, "../../app/dist", "index.html"),
          });
        }
      }
    });
  })
  .then(createMainWindow);

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
  // app.quit();
});
module.exports = {
  isDev,
};
