const reselect = require("reselect");
const {Validator} = require("jsonschema");
const path = require("path-browserify");
const editors = require("lib/editors");

// const {createSelector} = reselect;

function createSelector(name, ...args) {
  const selector = reselect.createSelector.apply(null, args);
  return function select() {
    const result = selector.apply(null, arguments);
    console.groupCollapsed(` selector ${name}`);
    console.groupEnd();
    return result;
  };
}

function validateForEditor(type, value) {
    if (!editors[type]) {
      return [`Your _editor.config specified '${type}', but there is no editor defined for it.`];
    }

    if (!editors[type].test) {
      return null;
    }

    if (!editors[type].test(value)) {
      return [`The value set for this field failed the validation test for the '${type}' editor.`];
    }

    return null;
}

const validateSelector = createSelector(
  "validateSelector",
  state => state.CurrentFile.present,
  state => state.Project,
  (CurrentFile, Project) => {
    const schema = Project.schema;

    const frontmatter = Object.assign({}, CurrentFile.frontmatter);

    const fields = schema.map(definition => {
      const key = definition.key;
      const item = {
        key,
        value: frontmatter[key],
        editor: "default"
      };

      item.label = definition.label || key;

      // TODO: make this more generic
      if (definition.resolve && item.value) {
        item.path = path.resolve(Project.path, definition.resolve, item.value);
      }

      const type = definition.type;

      if (type) {
        if (editors[type] && editors[type].coerce) item.value = editors[type].coerce(item.value);
        const errors = validateForEditor(type, item.value);
        if (errors) {
          item.errors = errors;
        } else {
          item.editor = type;
        }
      }

      delete frontmatter[key];

      return item;
    });

    // If there are leftover items, add them here
    Object.keys(frontmatter).forEach(key => {
      fields[key] = {
        key,
        value: frontmatter[key],
        editor: "default",
        errors: [`No schema definition found for ${key}`]
      };
    });

    return Object.assign({}, CurrentFile, {fields});
  }
);

const sidebarSelector = createSelector(
  "sidebarSelector",
  state => state.CurrentFile.present,
  state => state.Project,
  (CurrentFile, Project) => {
    return {
      Project: {
        name: Project.name,
        files: Project.files.map(filePath => {
          return {
            open: filePath === CurrentFile.path,
            path: filePath,
            basename: path.basename(filePath)
          };
        })
      }
    };
  }
);

module.exports = {
  validateSelector,
  sidebarSelector
};
