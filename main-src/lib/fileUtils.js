"use strict";

const all = require("bluebird").all;
const fs = require("fs-extra-promise");
const path = require("path");
const yamlFront = require("yaml-front-matter");
const parseYaml = require("yamljs").parse;

const ALLOWED_PATHS = new Set([".md", ".markdown"]);
const IMAGE_BASE_DIR = path.resolve(__dirname, "./tmp/assets");
const ALLOWED_FILE_TYPES = new Set([".md", ".markdown"]);
const POSTS_DIR = "_posts";
const CONFIG_FILENAME = "_config.yml";
const EDITOR_CONFIG_FILENAME = "_editor.yml";

const copyImage = module.exports.copyImage = originalPath => {
  return new Promise((resolve, reject) => {
    const basename = path.parse(originalPath).base;
    const newPath = path.join(IMAGE_BASE_DIR, basename);
    fs.copy(originalPath, newPath)
      .then(() => resolve({path: newPath, basename}))
      .catch(reject);
  });
};

const readJekyllConfig = module.exports.readJekyllConfig = (projectDir, configPath) => {
  configPath = configPath || CONFIG_FILENAME;
  return new Promise((resolve, reject) => {
    fs.readFileAsync(path.resolve(projectDir, configPath), "utf8")
      .then(data => {
        resolve(parseYaml(data));
      })
      .catch(reject);
  });
};

const readEditorConfig = module.exports.readEditorConfig = (projectDir, configPath) => {
  configPath = configPath || EDITOR_CONFIG_FILENAME;
  return new Promise((resolve, reject) => {
    fs.readFileAsync(path.resolve(projectDir, configPath), "utf8")
      .then(data => {
        resolve(parseYaml(data).editor);
      })
      .catch(reject);
  });
}

const readPost = module.exports.readPost = filePath => {
  return new Promise((resolve, reject) => {
    fs.readFileAsync(filePath, "utf8")
      .then(data => {
        const results = yamlFront.loadFront(data);
        const content = results.__content;
        delete results.__content;
        resolve({
          path: filePath,
          content,
          frontmatter: results
        });
      })
      .catch(reject);
  });
};

const readProject = module.exports.readProject = dirPath => {
  return new Promise((resolve, reject) => {
    const postDirPath = path.resolve(dirPath, POSTS_DIR);

    all([readJekyllConfig(dirPath), fs.readdirAsync(postDirPath), readEditorConfig(dirPath)])
      .then((results) => {
        const config = results[0];
        const allFiles = results[1];
        const editorConfig = results[2];
        const files = allFiles
          .filter(filePath => ALLOWED_FILE_TYPES.has(path.extname(filePath).toLowerCase()))
          .map(filePath => {
            return path.resolve(postDirPath, filePath);
          });
        const schema = editorConfig.metadata;
        resolve({
          path: dirPath,
          files,
          name: config.title,
          schema
        });
      })
      .catch(reject); // TODO more specific file handling
  });
};
