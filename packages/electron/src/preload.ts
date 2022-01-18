import { ipcRenderer } from "electron";
// We need to wait until the main world is ready to receive the message before
// sending the port. We create this promise in the preload so it's guaranteed
// to register the onload listener before the load event is fired.
const windowLoaded = new Promise((resolve) => {
  ipcRenderer.send("request-worker-channel");

  window.onload = resolve;
});

ipcRenderer.on("main-world-port", async (event) => {
  await windowLoaded;
  window.postMessage("main-world-port", "*", event.ports);
});
