const React = require("react");

const Webview = React.createClass({
  componentDidMount() {
    this.webview = document.createElement("webview");
    this.webview.setAttribute("preload", "./main-src/webview-preload.js");
    this.webview.setAttribute("autosize", "on")
    this.webview.src = this.props.url;
    this.refs.webviewContainer.parentNode.replaceChild(this.webview, this.refs.webviewContainer);

  },
  render() {
    return (<div ref="webviewContainer" />);
  }
});

module.exports = Webview;
