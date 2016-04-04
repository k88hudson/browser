const React = require("react");
const brace = require("brace");
const AceEditor = require("react-ace");

require('brace/mode/markdown');
require('brace/theme/github');

const MarkdownEditor = React.createClass({
  render() {
    return (<div className="multiline-editor"><AceEditor
      value={this.props.value}
      height={this.props.height}
      width="100%"
      onChange={this.props.onChange}
      mode="markdown"
      theme="github"
      name={this.props.name}
      showGutter={false}
      wrapEnabled={true}
      showPrintMargin={false}
      editorProps={{$blockScrolling: true}}
    /></div>);
  }
});

module.exports = MarkdownEditor;
