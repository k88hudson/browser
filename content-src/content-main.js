const React = require("react");
const ReactDOM = require("react-dom");
const {Provider} = require("react-redux");
const store = require("lib/store");
const app = platform_require("electron").remote.app;
const urlParse = require("url-parse");

const Main = require("components/Main");
const Sidebar  = require("components/Sidebar");
const WebView = require("components/WebView");

// const Root = React.createClass({
//   render() {
//     return (<Provider store={store}>
//       <div id="outer">
//         <Sidebar />
//         <Main />
//       </div>
//     </Provider>);
//   }
// });

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function defaultTab() {
  return {
    url: app._basePath + "/newtab.html",
    displayUrl: "",
    placeholder: "about:newtab",
    title: ""
  };
}

const Root = React.createClass({
  getInitialState() {
    const id = guid();
    return {
      activeTabId: id,
      tabs: new Map([[id, defaultTab()]])
    };
  },
  currentTab() {
    return this.state.tabs.get(this.state.activeTabId);
  },
  addTab() {
    const tabs = new Map(this.state.tabs);
    const id = guid();
    tabs.set(id, defaultTab());
    this.setState({activeTabId: id, tabs});
  },
  removeTab(id) {
    const tabs = new Map(this.state.tabs);
    tabs.delete(id);
    const activeTabId = (id === this.state.activeTabId) ? tabs.get(tabs.keys().next().value) : this.state.activeTabId;
    console.log('delete', tabs);
    this.setState({tabs, activeTabId});
  },
  setActiveTab(id) {
    this.setState({activeTabId: id});
  },
  updateTab(id, newProps) {
    const tabs = new Map(this.state.tabs);
    tabs.set(id, Object.assign(this.state.tabs.get(id), newProps));
    this.setState({tabs});
  },
  setUrl(id, url) {
    const parsed = urlParse(url, "http://");
    url = parsed.href;
    if (url === this.state.tabs.get(id).url) return;
    const displayUrl = url.replace(parsed.protocol + "//", "");

    this.updateTab(id, {url, displayUrl});
  },
  render() {
    const tabIds = Array.from(this.state.tabs.keys());
    // tabIds.forEach(id => {
    //   console.log(id, this.state.tabs.get(id).displayUrl);
    // });
    return (<div>
      <div className="tabs">
        {tabIds.map(id => {
          const tab = this.state.tabs.get(id);
          return (<div
              key={id}
              id={"tab-" + id}
              className={"tab" + (id === this.state.activeTabId ? " active" : "")}
              onClick={e => this.setActiveTab(id)}>
            <div className="middle"><div className="title">{tab.title}</div></div>
            <button className="transparent delete" onClick={e => {e.preventDefault(); this.removeTab(id);}}>
              <span className="fa fa-times" />
            </button>
          </div>);
        })}
        <button onClick={this.addTab} className="transparent"><span className="fa fa-plus" /></button>
      </div>
      {tabIds.map(id => {
        const tab = this.state.tabs.get(id);
        return (<WebView
          key={id}
          id={id}
          {...tab}
          active={id === this.state.activeTabId}
          setUrl={url => this.setUrl(id, url)}
          updateTab={updates => this.updateTab(id, updates)}
        />);
      })}

    </div>);
  }
});

ReactDOM.render(<Root />, document.getElementById("root"));
