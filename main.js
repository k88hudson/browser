"use strict";

const electron = require("electron");
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const menu = require("./main-src/lib/menu");

let mainWindow = null;

app._basePath = 'file://' + __dirname;

function createWindow () {
  menu();
  mainWindow = new BrowserWindow({
    title: "Browser",
    icon: __dirname + "/firefox.icns",
    width: 800,
    height: 600,
    "title-bar-style": "hidden-inset"
  });
  mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.on("closed", function() {
    mainWindow = null;
  });
  // mainWindow.setMenuBarVisibility(false);
  // mainWindow.setAutoHideMenuBar(true);
}

app.on('ready', () => {
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
