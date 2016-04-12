const urlParse = require("url-parse");
const TRAILING_SLASH_REGEX = /\/$/;

module.exports.normalizeUrl = function normalizeUrl(url) {
  const parsed = urlParse(url);
  if (TRAILING_SLASH_REGEX.test(parsed.pathname)) {
    parsed.set("pathname", parsed.pathname.replace(TRAILING_SLASH_REGEX, ""));
  }
  return parsed.toString();
};

module.exports.awesomeBarToUrl = function awesomeBarToUrl(url) {
  if (/\s/.test(url) || !/\./.test(url)) {
    url = "https://google.com?gws_rd=ssl#q=" + encodeURIComponent(url);
  }
  return normalizeUrl(url);
};
