const React = require("react");
const ReactDOM = require("react-dom");
const {Provider} = require("react-redux");
const store = require("lib/store");

const Main = require("components/Main");

const Root = React.createClass({
  render() {
    return (<Provider store={store}>
      <Main />
    </Provider>);
  }
});


ReactDOM.render(<Root />, document.getElementById("root"));
