"use strict";
const path = require("path");
const absolute = (relPath) => path.join(__dirname, relPath);
const webpack = require("webpack");
const PathChunkPlugin = require('path-chunk-webpack-plugin');

const SRC_PATH = absolute("./content-src/content-main.js");
const OUTPUT_DIR = absolute("./data");
const OUTPUT_FILENAME = "[name].bundle.js";
const VENDOR_OUTPUT_FILENAME = "vendor.bundle.js";
// const ElectronPlugin = require("./lib/electron-require-webpack-plugin");
const BannerPlugin = require("webpack").BannerPlugin;

module.exports = {
  entry: {
    app: SRC_PATH
  },
  output: {
    path: OUTPUT_DIR,
    filename: OUTPUT_FILENAME,
    chunkFilename: OUTPUT_FILENAME
  },
  devtool: "sourcemaps",
  resolve: {
    extensions: ["", ".js", ".jsx"],
    alias: {
      "components": absolute("./content-src/components"),
      "reducers": absolute("./content-src/reducers"),
      "actions": absolute("./common/actions"),
      "selectors": absolute("./content-src/selectors"),
      "lib": absolute("./content-src/lib"),
      "common": absolute("./common")
    }
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: /.\/(content-src)\//,
        loader: "babel"
      }
    ]
  },
  plugins: [
    // new PathChunkPlugin({
    //   name: 'vendor',
    //   test: /node_modules\//
    // }),
    new BannerPlugin("'use strict';\nlet platform_require = require; let platform_process = process;\n", {
      raw: true,
      include: "app.bundle.js"
    })
  ]
};
