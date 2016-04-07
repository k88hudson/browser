"use strict";
const ActionCreators = require("redux-undo").ActionCreators;

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

module.exports = {
  OpenInspector,
  CloseInspector,
  RemoveTab,
  SelectTab,
  UpdateTab,
  AddTab,
  SetUrl
};
