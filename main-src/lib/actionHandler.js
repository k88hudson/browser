const actions = require("../../common/actions/actions");
const fileUtils = require("./fileUtils");
const copyImage = fileUtils.copyImage;
const readProject = fileUtils.readProject;
const readPost = fileUtils.readPost;

module.exports = outgoingEvent => function(event, action) {
  console.log("received " + action.type);

  const target = event.sender;
  const reply = e => {
    console.error(e);
    target.send(outgoingEvent, e);
  };

  switch(action.type) {
    case "POST_IMAGE_REQUEST":
      copyImage(action.data.path)
        .then(data => reply(actions.ImageResponse(data)))
        .catch(e => reply(actions.ImageResponse(e, {error: true})))
      break;
    case "OPEN_PROJECT_REQUEST":
      readProject(action.data.path)
        .then(data => reply(actions.OpenProjectResponse(data)))
        .catch(e => reply(actions.OpenProjectResponse(e, {error: true})))
      break;
    case "OPEN_FILE_REQUEST":
      readPost(action.data.path)
        .then(data => reply(actions.OpenFileResponse(data)))
        .catch(e => reply(actions.OpenFileResponse(e, {error: true})))
      break;
    default:
      console.log(`received ${action.type}`);
  }
};
