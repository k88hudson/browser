"use strict";

const DEFAULT_OPTIONS = {
  timeout: 5000
};

class Channel {
  constructor(options, messager) {
    if (!options.incoming) {
      throw new Error("You must specify an incoming event name with the 'incoming' option.");
    }
    if (!options.outgoing) {
      throw new Error("You must specify an outgoing event name with the 'outgoing' option.");
    }
    if (!messager || typeof messager.on !== "function") {
      throw new Error("You must specify a messager with 'send' and 'on' functions");
    }
    this.messager = messager;
    this.options = Object.assign({}, DEFAULT_OPTIONS, options);
    this.timeouts = new Map();
  }

  send(details) {
    const send = this.options.send || this.messager.send;
    send(this.options.outgoing, details);
  }

  on(callback) {
    this.messager.on(this.options.incoming, callback);
  }

  destroy() {
    this.messager.removeAllListeners(this.options.incoming);
    this.timeouts.forEach(callback => clearTimeout(callback));
    this.timeouts.clear();
  }

  connectStore(store) {
    this.messager.on(this.options.incoming, (e, details) => {
      store.dispatch(details);
    });
  }

  get middleware() {
    return store => next => function(action) {
      const meta = action.meta || {};
      const timeouts = this.timeouts;

      // Send action to the next step in the middleware
      next(action);

      // Check if we were expecting this action from a RequestExpect.
      // If so, clear the timeout and remote it from the list
      if (timeouts.has(action.type)) {
        clearTimeout(timeouts.get(action.type));
        timeouts.delete(action.type);
      }

      // If this is a RequestExpect, add a timeout
      // So that we dispatch an error if the expected response
      // is never received.
      if (meta.expect) {
        const time = meta.timeout || this.options.timeout;
        const timeout = setTimeout(() => {
          const error = new Error(`Expecting ${meta.expect} but it timed out after ${time}ms`);
          error.name = "E_TIMEOUT";
          store.dispatch({type: meta.expect, error: true, data: error});
        }, time);
        timeouts.set(meta.expect, timeout);
      }

      // If the action has the right "broadcast" property on the meta property,
      // send it to the other side of the channel.
      if (meta.broadcast === this.options.outgoing) {
        this.send(action);
      }
    }.bind(this);
  }
};

module.exports = Channel;
