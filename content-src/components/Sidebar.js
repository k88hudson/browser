const React = require("react");
const {sidebarSelector} = require("selectors/selectors");
const {connect} = require("react-redux");
const {OpenFileRequest} = require("actions/actions");
const classnames = require("classnames");
const Icon = require("components/Icon");

const Sidebar = React.createClass({
  openFile(pathName) {
    this.props.dispatch(OpenFileRequest(pathName));
  },
  render() {
    const {files, name} = this.props.Project;
    return (<aside>
      <ul className="file-list">
        <li className="project">{name}</li>
        {files.map((item, i) => {
          return (<li key={i} className={classnames({open: item.open})}><a href="#" onClick={e => {
            e.preventDefault();
            this.openFile(item.path);
          }}><Icon image="file-text" /> {item.basename}</a></li>);
        })}
      </ul>
    </aside>);
  }
});

module.exports = connect(sidebarSelector)(Sidebar);
