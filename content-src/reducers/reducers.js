const urlParse = require("url-parse");
const {awesomeBarToUrl, getDisplayUrl} = require("common/browserUtils");

// TODO: add to utils
const app = platform_require("electron").remote.app;
function defaultTab() {
  return {
    // url: "app._basePath + "/newtab.html",
    url: "https://www.google.ca",
    displayUrl: "",
    placeholder: "about:newtab",
    title: "",

    // is the page currently loading?
    loading: false,

    // did it fail
    error: false,

    // metadata
    isBookmark: false

  };
}
function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

const id = guid();
const DEFAULT_STATE = {
  Inspector: {
    visible: false
  },
  Tabs: {
    activeTabId: id,
    rows: new Map([[id, defaultTab()]])
  }
};

module.exports = {
  Inspector(prevState = DEFAULT_STATE.Inspector, action) {
    switch (action.type) {
      case "NOTIFY_OPEN_INSPECTOR":
        return {visible: true};
      case "NOTIFY_CLOSE_INSPECTOR":
        return {visible: false};
      default:
        return prevState;
    }
  },
  Tabs(prevState = DEFAULT_STATE.Tabs, action) {
    const rows = new Map(prevState.rows);
    let activeTabId;
    let currentTab;
    let id;
    let url;
    switch (action.type) {
      case "ADD_TAB":
        id = guid();
        rows.set(id, defaultTab());
        return {activeTabId: id, rows};
      case "REMOVE_TAB":
        rows.delete(action.data.id);
        activeTabId = (action.data.id === prevState.activeTabId) ? rows.keys().next().value : prevState.activeTabId;
        return {activeTabId, rows};
      case "UPDATE_TAB":
        rows.set(action.data.id, Object.assign(rows.get(action.data.id), action.data.props));
        return Object.assign({}, prevState, {rows});
      case "SELECT_TAB":
        activeTabId = action.data.id;
        return Object.assign({}, prevState, {activeTabId});
      case "SET_URL":
        url = awesomeBarToUrl(action.data.url);
        id = action.data.tabId;

        // No change
        if (url === rows.get(id).url) {
          return prevState;
        }
        let displayUrl = getDisplayUrl(url);
        rows.set(id, Object.assign(rows.get(id), {
          url,
          displayUrl
        }));
        return Object.assign({}, prevState, {rows});
      case "RESPONSE_METADATA":
        rows.forEach(tab => {
          if (action.data.url === tab.url) {
            tab.isBookmark = action.data.isBookmark;
          } else {
            return tab;
          }
        });
        return Object.assign({}, prevState, {rows});
      default:
        return prevState;
    }
  }
}
