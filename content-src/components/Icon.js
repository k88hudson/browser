const React = require("react");

const Icon = React.createClass({
  render() {
    return (<span className={`fa fa-${this.props.image}`} />);
  }
});

module.exports = Icon;
