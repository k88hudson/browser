const electron =  require("electron");
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;
const actionHandler = require("./actionHandler");
const Channel = require("../../common/Channel");

const channel =  new Channel({
  incoming: "content-to-main",
  outgoing: "main-to-content",
  send(eventName, details) {
    BrowserWindow.getFocusedWindow().webContents.send(eventName, details);
  }
}, ipcMain);

const handler = actionHandler("main-to-content");

channel.on(handler);

module.exports = channel;
