const React = require("react");
const {connect} = require("react-redux");
const actions = require("common/actions/actions");
const Webview = require("components/Webview");
const {getDisplayUrl, normalizeUrl} = require("common/browserUtils");
const Browser = React.createClass({
  getInitialState() {
    return {metadata: {}};
  },
  goBack() {
    this.webview.goBack();
  },
  refresh() {
    this.webview.src = this.webview.src;
  },
  onChange(e) {
    this.props.updateTab({displayUrl: e.target.value});
  },
  onFocus(e) {
    e.target.select();
  },
  onSubmit(e) {
    e.preventDefault();
    this.props.setUrl(this.props.displayUrl);
  },
  componentDidMount() {

    this.webview = document.createElement("webview");
    this.webview.setAttribute("preload", "./main-src/webview-preload.js");
    this.webview.setAttribute("autosize", "on")
    this.webview.src = this.props.url;
    this.refs.webviewContainer.appendChild(this.webview);

    this.webview.addEventListener("did-navigate", e => {
      console.log('did-navigate', e.url);
      this.props.updateTab({url: normalizeUrl(e.url), displayUrl: getDisplayUrl(e.url)});
      this.props.dispatch(actions.RequestMetaData(e.url));
    });

    this.webview.addEventListener("did-navigate-in-page", e => {
      console.log('did-navigate-in-page', e.url);
      this.props.updateTab({url: normalizeUrl(e.url), displayUrl: getDisplayUrl(e.url)});
      this.props.dispatch(actions.RequestMetaData(e.url));
    });


    this.webview.addEventListener("console-message", e => {
      if (!/^read-dom/.test(e.message)) return;
    });

    this.webview.addEventListener('ipc-message', event => {
      if (event.channel === "read-dom") {
        const htmlText = JSON.parse(event.args[0]);
        this.props.updateTab({title: htmlText.title});
        this.setState({metadata: htmlText});
      }
    });

    this.webview.addEventListener("dom-ready", e => {
      // this.refs.webview.openDevTools();
    });

    this.webview.addEventListener("did-start-loading", e => {
      this.props.dispatch(actions.UpdateTab(this.props.id, {loading: true, error: false, title: "Loading..."}));
    });

    this.webview.addEventListener("did-stop-loading", e => {
      this.props.dispatch(actions.UpdateTab(this.props.id, {loading: false}));
    });

    this.webview.addEventListener("did-fail-load", e => {
      this.props.dispatch(actions.UpdateTab(this.props.id, {error: true, title: "Problem loading page"}))
    });

  },

  componentDidUpdate(prevProps) {
    if (this.props.url !== prevProps.url && this.props.url !== normalizeUrl(this.webview.getURL())) {
      this.webview.src = this.props.url;
    }
  },

  render() {
    const buttons = [
      {
        icon: this.props.isBookmark ? "star" : "star-o",
        onClick: () => this.props.dispatch(actions.CreateBookmark(this.props.url))
      },
      {
        icon: "bars",
        onClick: () => {}
      }
    ];
    return (<div className="browser-container" hidden={!this.props.active}>
      <div className="url-bar">
        <button className="back-button" onClick={this.goBack}><span className="fa fa-arrow-left" /></button>
        <div className="toolbar-area">
          <div className="input-container">
            <form onSubmit={this.onSubmit}>
              <input
                placeholder={this.props.placeholder}
                name={this.props.id + "-input"}
                value={this.props.displayUrl}
                onChange={this.onChange}
                onFocus={this.onFocus} />
            </form>
            <button className="refresh-btn" onClick={e => { e.preventDefault(); this.refresh()}}>
              <span className="fa fa-refresh" />
            </button>
          </div>
          <ul className="toolbar">
            {buttons.map(({icon, onClick}) => {
              return (<li key={icon}><button onClick={onClick} className="transparent">
                <span className={`fa fa-${icon}`} />
              </button></li>);
            })}
          </ul>
        </div>
      </div>
      <div hidden={!this.props.error} className="webview-container load-fail">
        Oops! There was a problem loading this page.
      </div>
      <div hidden={this.props.error} className="webview-container" ref="webviewContainer" />
      <div hidden={!this.props.Inspector.visible} className="inspector">
        <header>
          <button onClick={() => this.props.dispatch(actions.CloseInspector())}><span className="close-btn fa fa-times" /></button>
        </header>
        <main>
          <pre>{JSON.stringify(this.state.metadata, null, 2)}</pre>
          <img hidden={!this.state.metadata.favicon} height={24} width={24} src={this.state.metadata.favicon} />
          <img hidden={!this.state.metadata.ogimage} height={150} src={this.state.metadata.ogimage} />
        </main>
      </div>
    </div>);
  }
});

module.exports = connect(() => ({}))(Browser);
