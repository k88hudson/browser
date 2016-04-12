const actions = require("../../common/actions/actions");
const db = require("../db");

module.exports = outgoingEvent => function(event, action) {
  console.log("received " + action.type);

  const target = event.sender;
  const reply = e => {
    console.error(e);
    target.send(outgoingEvent, e);
  };
  const type = action.type;
  const data = action.data;

  switch(type) {
    case "NOTIFY_CREATE_BOOKMARK":
      db.createBookmark(data)
        .then(result => {
          reply(actions.Response("RESPONSE_METADATA", {
            url: data,
            isBookmark: true
          }));
        })
        .catch(e => {
          console.log(e);
        });
      break;
    case "NOTIFY_REMOVE_BOOKMARK":
      db.removeBookmark(data)
      .then(result => {
        reply(actions.Response("RESPONSE_METADATA", {
          url: data,
          isBookmark: false
        }));
      })
      .catch(e => {
        console.log(e);
      });
    case "REQUEST_BOOKMARKS":
      db.getBookmarks()
      .then(result => {
        reply(actions.Response("RESPONSE_BOOKMARKS", result));
      })
      .catch(e => {
        console.log(e);
      });
    case "REQUEST_METADATA":
      if (!data) return;
      db.getBookmark(data)
        .then(result => {
          reply(actions.Response("RESPONSE_METADATA", {
            url: data,
            isBookmark: !!result.length
          }));
        })
        .catch(e => {
          console.log(e);
        });
    default:
      console.log(`received ${action.type}`);
  }
};
