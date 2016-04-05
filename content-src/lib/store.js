const {createStore, applyMiddleware, combineReducers} = require("redux");
const {persistStore, autoRehydrate} = require("redux-persist");
const thunk = require("redux-thunk").default;
const reducers = require("reducers/reducers");
const Channel = require("lib/channel");

const middleware = [
  thunk,
  Channel.middleware
];

// TODO: Config
// if (__CONFIG__.LOGGING) {
  const createLogger = require("redux-logger");
  middleware.push(createLogger({
    level: "info",
    collapsed: true
  }));
// }

const store = createStore(
  combineReducers(reducers),
  // autoRehydrate(),
  applyMiddleware(...middleware)
);

Channel.connectStore(store);

// persistStore(store);

module.exports = store;
