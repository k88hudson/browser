const React = require("react");

const WebView = React.createClass({
  getInitialState() {
    return {metadata: {}};
  },
  goBack() {
    this.refs.webview.goBack();
  },
  onChange(e) {
    console.log(this.props.id);
    this.props.updateTab({displayUrl: e.target.value});
  },
  onSubmit(e) {
    e.preventDefault();
    this.props.setUrl(this.props.displayUrl);
  },
  componentDidMount() {
    this.refs.webview.addEventListener("did-navigate", e => {
      this.props.setUrl(e.url);
    });
    this.refs.webview.addEventListener("did-navigate-in-page", e => {
      this.props.setUrl(e.url);
    });
    this.refs.webview.addEventListener("console-message", e => {
      if (!/^read-dom/.test(e.message)) return;
      const htmlText = JSON.parse(e.message.replace(/^read-dom/, ""));
      // console.log(htmlText);
      this.props.updateTab({title: htmlText.title});
      this.setState({metadata: htmlText});
    });

    this.refs.webview.addEventListener("dom-ready", e => {
      // this.refs.webview.openDevTools();
    });

    this.refs.webview.addEventListener("load-commit", e => {
      console.log(e);
    });

    this.refs.webview.addEventListener("did-get-response-details", e => {
      // console.log("event", e);
      this.refs.webview.executeJavaScript(`
        (function() {
          const favicon = document.querySelector('link[rel="shortcut icon"]');
          const ogimage = document.querySelector('meta[property="og:image"]');
          const data = {
            title: document.title,
            url: document.location.href,
            favicon: favicon && favicon.href,
            ogimage: ogimage && ogimage.content
          };
          console.log("read-dom" + JSON.stringify(data));
        })()

      `);
    });
  },
  render() {
    return (<div className="webview-container" hidden={!this.props.active}>
      <div className="url-bar">
        <button className="back-button" onClick={this.goBack}><span className="fa fa-arrow-left" /></button>
        <form onSubmit={this.onSubmit}>
          <input placeholder={this.props.placeholder} name={this.props.id + "-input"} value={this.props.displayUrl} onChange={this.onChange} />
        </form>
      </div>
      <webview ref="webview"
        className="webview"
        src={this.props.url}
        autosize="on" />
      <div className="inspector">
        <pre>{JSON.stringify(this.state.metadata, null, 2)}</pre>
        <img hidden={!this.state.metadata.favicon} height={24} width={24} src={this.state.metadata.favicon} />
        <img hidden={!this.state.metadata.ogimage} height={150} src={this.state.metadata.ogimage} />
      </div>
    </div>);
  }
});

module.exports = WebView;
