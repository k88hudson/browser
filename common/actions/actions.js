"use strict";
const ActionCreators = require("redux-undo").ActionCreators;

const OUTGOING_EVENT = "content-to-main";
const INCOMING_EVENT = "main-to-content";

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

function UpdateFrontMatter(key, value) {
  let update;
  if (typeof key === "string") {
    update = {};
    update[key] = value;
  } else if (key && typeof key === "object"){
    update = key;
  }
  return {
    type: "EDITOR_VALUE_UPDATE",
    data: update
  };
}

function UpdateContent(value) {
  return {
    type: "CONTENT_VALUE_UPDATE",
    data: value
  };
}

function ImageRequest(filePath) {
  return RequestExpect("POST_IMAGE_REQUEST", "POST_IMAGE_RESPONSE", {path: filePath});
}

function ImageResponse(data, options) {
  return Response("POST_IMAGE_RESPONSE", data, options);
}

function OpenFileRequest(filePath) {
  return RequestExpect("OPEN_FILE_REQUEST", "OPEN_FILE_RESPONSE", {data: {path: filePath}});
}

function OpenFileResponse(data, options) {
  return Response("OPEN_FILE_RESPONSE", data, options);
}

function OpenProjectRequest(filePath) {
  return RequestExpect("OPEN_PROJECT_REQUEST", "OPEN_PROJECT_RESPONSE", {data: {path: filePath}});
}

function OpenProjectResponse(data, options) {
  return Response("OPEN_PROJECT_RESPONSE", data, options);
}

module.exports = {
  UpdateFrontMatter,
  UpdateContent,
  ImageRequest,
  ImageResponse,
  OpenFileRequest,
  OpenFileResponse,
  OpenProjectRequest,
  OpenProjectResponse,
  Undo: ActionCreators.undo,
  Redo: ActionCreators.redo
};
