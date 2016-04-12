"use strict";
const ActionCreators = require("redux-undo").ActionCreators;
const normalizeUrl = require("../browserUtils").normalizeUrl;
const OUTGOING_EVENT = "content-to-main";
const INCOMING_EVENT = "main-to-content";

function NotifyContent(type, data) {
  const action = {
    type,
    meta: {broadcast: INCOMING_EVENT}
  };
  if (data) {
    action.data = data;
  }
  return action;
}

function NotifyAddon(type, data) {
  const action = {
    type,
    meta: {broadcast: OUTGOING_EVENT}
  };
  if (data) {
    action.data = data;
  }
  return action;
}


function Response(type, data, options) {
  options = options || {};
  const action = {
    type,
    data,
    meta: {broadcast: INCOMING_EVENT}
  };
  if (options.error) {
    action.error = true;
  }
  return action;
}

function RequestExpect(type, expect, options) {
  options = options || {};
  const action = {
    type,
    meta: {broadcast: OUTGOING_EVENT, expect}
  };
  if (options.timeout) {
    action.meta.timeout = options.timeout;
  }
  if (options.data) {
    action.data = options.data;
  }
  return action;
}

function OpenInspector() {
  return NotifyContent("NOTIFY_OPEN_INSPECTOR");
}
function CloseInspector() {
  return NotifyContent("NOTIFY_CLOSE_INSPECTOR");
}

function RemoveTab(id) {
  return {
    type: "REMOVE_TAB",
    data: {id}
  };
}

function SelectTab(id) {
  return {
    type: "SELECT_TAB",
    data: {id}
  };
}

function UpdateTab(id, props) {
  return {
    type: "UPDATE_TAB",
    data: {id, props}
  };
}

function AddTab() {
  return {type: "ADD_TAB"};
}

function SetUrl(tabId, url) {
  return {
    type: "SET_URL",
    data: {tabId, url}
  };
}

function CreateBookmark(url) {
  return NotifyAddon("NOTIFY_CREATE_BOOKMARK", normalizeUrl(url));
}

function RemoveBookmark(url) {
  return NotifyAddon("NOTIFY_REMOVE_BOOKMARK", normalizeUrl(url));
}


function RequestBookmarks() {
  return RequestExpect("REQUEST_BOOKMARKS", "RESPONSE_BOOKMARKS");
}

function RequestMetaData(url) {
  return RequestExpect("REQUEST_METADATA", "RESPONSE_METADATA", {data: normalizeUrl(url)});
}

module.exports = {
  RequestExpect,
  Response,
  OpenInspector,
  CloseInspector,
  RemoveTab,
  SelectTab,
  UpdateTab,
  AddTab,
  SetUrl,
  CreateBookmark,
  RemoveBookmark,
  RequestBookmarks,
  RequestMetaData
};
