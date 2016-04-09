const React = require("react");
const {connect} = require("react-redux");
const classnames = require("classnames")
const Browser = require("components/Browser");
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
    this.props.dispatch(actions.SetUrl(id, url));
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
            <span className={classnames("fa fa-spinner fa-spin", {on: tab.loading})} />
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
        return (<Browser
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
