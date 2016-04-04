const undoable = require("redux-undo").default;

const INITIAL_DIRECTIONS = "1. Step 1\n2. Step 2";

const DEFAULT_STATE = {
  CurrentFile: {
    empty: false,
    path: "untitled.md",
    frontmatter: {
      title: "",
      author: "",
      date: new Date().toString()
    },
    content: ""
  },
  Project: {
    path: "./tmp",
    name: "My project",
    files: [
      "untitled.md"
    ],
    schema: [
      {
        key: "title",
        type: "text",
        label: "Title",
        value: ""
      },
      {
        key: "author",
        type: "text",
        label: "Author",
        value: ""
      },
      {
        key: "date",
        type: "text",
        label: "Date",
        value: ""
      }
    ]
  }
};

const undoableConfig = {
  initTypes: ["OPEN_FILE_RESPONSE"]
};

module.exports = {
  CurrentFile: undoable((prevState = DEFAULT_STATE.CurrentFile, action) => {
    switch(action.type) {
      case "OPEN_PROJECT_RESPONSE":
        return {
          empty: true,
          path: "",
          frontmatter: {},
          content: ""
        };
      case "OPEN_FILE_RESPONSE":
        if (action.error) {
          console.error(action.data);
          return prevState;
        } else {
          return {
            empty: false,
            path: action.data.path,
            frontmatter: action.data.frontmatter,
            content: action.data.content
          };
        }
      case "EDITOR_VALUE_UPDATE":
        return Object.assign({}, prevState, {
          frontmatter: Object.assign({}, prevState.frontmatter, action.data)
        });
      case "CONTENT_VALUE_UPDATE":
        return Object.assign({}, prevState, {
          content: action.data
        });
      default:
        return prevState;
    }
  }, undoableConfig),
  Project(prevState = DEFAULT_STATE.Project, action) {
    switch(action.type) {
      case "OPEN_PROJECT_RESPONSE":
        if (action.error) {
          console.error(action.data);
          return prevState;
        } else {
          const newState = Object.assign({}, prevState, {
            path: action.data.path,
            name: action.data.name,
            files: action.data.files,
            schema: action.data.schema
          });
          return newState
        }
      default:
        return prevState;
    }

  }
};
