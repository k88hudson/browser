const React = require("react");
const {connect} = require("react-redux");
const classnames = require("classnames")
const WebView = require("components/WebView");
const urlParse = require("url-parse");
const actions = require("common/actions/actions");

const Main = React.createClass({
  removeTabFactory(id) {
    return e => {
      e.stopPropagation();
      e.preventDefault();
      this.props.dispatch(actions.RemoveTab(id));
    };
  },
  setActiveTab(id) {
    this.props.dispatch(actions.SelectTab(id));
  },
  updateTab(id, newProps) {
    this.props.dispatch(actions.UpdateTab(id, newProps));
  },
  setUrl(id, url) {
    if (/\s/.test(url) || !/\./.test(url)) {
      url = "https://google.com?gws_rd=ssl#q=" + encodeURIComponent(url);
    }
    const parsed = urlParse(url, "http://");
    url = parsed.href;
    if (url === this.props.Tabs.rows.get(id).url) return;
    const displayUrl = url.replace(parsed.protocol + "//", "");
    this.updateTab(id, {url, displayUrl});
  },
  addTab() {
    this.props.dispatch(actions.AddTab());
  },
  render() {
    const tabs = this.props.Tabs.rows;
    const activeTabId = this.props.Tabs.activeTabId;
    const tabIds = Array.from(tabs.keys());
    return (<div>
      <div className="tabs">
        {tabIds.map(id => {
          const tab = tabs.get(id);
          return (<div
              key={id}
              id={"tab-" + id}
              className={"tab" + (id === activeTabId ? " active" : "")}
              onClick={e => this.setActiveTab(id)}>
            <div className="middle"><div className="title">{tab.title}</div></div>
            <button className="transparent delete" onClick={this.removeTabFactory(id)}>
              <span className="fa fa-times" />
            </button>
          </div>);
        })}
        <button onClick={this.addTab} className="add-tab-btn transparent"><span className="fa fa-plus" /></button>
      </div>
      {tabIds.map(id => {
        const tab = tabs.get(id);
        return (<WebView
          key={id}
          id={id}
          {...tab}
          active={id === activeTabId}
          setUrl={url => this.setUrl(id, url)}
          updateTab={updates => this.updateTab(id, updates)}
          Inspector={this.props.Inspector}
        />);
      })}

    </div>);
  }
});

module.exports = connect(state => ({
  Inspector: state.Inspector,
  Tabs: state.Tabs
}))(Main);
