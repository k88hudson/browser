"use strict";
const BannerPlugin = require("webpack").BannerPlugin;

module.exports = class ElectronRequire extends BannerPlugin {
  constructor(mainPaths) {
    super("const platform_require = require;\n", {
      raw: true,
      include: mainPaths
    });
  }
}
