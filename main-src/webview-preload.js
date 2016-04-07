const ipcRenderer = require("electron").ipcRenderer;

function onLoad() {
  const favicon = document.querySelector('link[rel="shortcut icon"]');
  const ogimage = document.querySelector('meta[property="og:image"]');
  const desc = document.querySelector('meta[name="description"]');
  const data = {
    title: document.title,
    url: document.location.href,
    description: desc && desc.content,
    favicon: favicon && favicon.href,
    ogimage: ogimage && ogimage.content,
    fullText: document.documentElement.innerHTML
  };
  ipcRenderer.sendToHost("read-dom", JSON.stringify(data));
  window.removeEventListener("DOMContentLoaded", onLoad);
}

if (document.readyState === "complete") {
  onLoad();
} else {
  window.addEventListener("DOMContentLoaded", onLoad);
}
