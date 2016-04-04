const {ipcRenderer} = platform_require("electron");

const Channel = require("common/channel");

module.exports = new Channel({
  incoming: "main-to-content",
  outgoing: "content-to-main"
}, ipcRenderer);
