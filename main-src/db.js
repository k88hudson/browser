const mkdirp = require("mkdirp");
const {normalizeUrl} = require("./lib/browserUtils");
mkdirp("./profiles");

const knex = require('knex')({
  client: "sqlite3",
  connection: {
    filename: "./profiles/places.sqlite"
  },
  useNullAsDefault: true
});

knex.schema.createTableIfNotExists("history", function (table) {
  table.increments();
  table.string("url");
  table.dateTime("lastVisitDate");
  table.timestamp("deletedAt");
  table.timestamp("updatedAt").defaultTo(knex.fn.now());
  table.timestamp("createdAt").defaultTo(knex.fn.now());
}).then(() => {
  console.log("history created");
})

knex.schema.createTableIfNotExists("bookmarks", function (table) {
  table.increments();
  table.string("url").unique();
  table.timestamp("deletedAt");
  table.timestamp("updatedAt").defaultTo(knex.fn.now());
  table.timestamp("createdAt").defaultTo(knex.fn.now());
}).then(() => {
  console.log("bookmarks created");
});

// TODO block until this is done, or at least track ready state.
// move to an init function w/ callback.

module.exports = {
  createBookmark(url) {
    url = normalizeUrl(url);
    return knex("bookmarks").insert({url}).whereNotExists(function() {
      this.select('*').from("bookmarks").where("url", url);
    });
  },
  removeBookmark(url) {
    url = normalizeUrl(url);
    return knex("bookmarks").where("url", url)
      .update("deletedAt", knex.fn.now());
  },
  getBookmark(url) {
    url = normalizeUrl(url);
    console.log("getBookmark", url);
    return knex("bookmarks").where("url", url);
    // todo check deletedAt
  },
  getBookmarks() {
    return knex("bookmarks").select().limit(10);
  }
};
