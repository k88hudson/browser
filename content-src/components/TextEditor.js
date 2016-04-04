const React = require("react");

const TextEditor = React.createClass({
  render() {
    return <input value={this.props.value} onChange={e => this.props.onChange(e.target.value)} />
  }
});

module.exports = TextEditor;
