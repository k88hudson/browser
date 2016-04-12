const urlParse = require("url-parse");
const TRAILING_SLASH_REGEX = /\/$/;
const WWW_REGEX = /^www\./i;
const LOCATION = {protocol: "http:", pathname: "/"};

function normalizeUrl(url) {
  const parsed = urlParse(url, LOCATION);
  if (TRAILING_SLASH_REGEX.test(parsed.pathname)) {
    parsed.set("pathname", parsed.pathname.replace(TRAILING_SLASH_REGEX, ""));
  }
  return parsed.toString();
}

function awesomeBarToUrl(url) {
  if (/\s/.test(url) || !/(\.|:)/.test(url)) {
    url = "https://google.com?gws_rd=ssl#q=" + encodeURIComponent(url);
  }
  return normalizeUrl(url);
}

function getDisplayUrl(url) {
  return normalizeUrl(url);

  const parsed = urlParse(url, LOCATION);
  // if (WWW_REGEX.test(parsed.hostname)) parsed.set("hostname", parsed.hostname.replace(WWW_REGEX, ""));
  return normalizeUrl(parsed.toString()).replace(parsed.protocol + "//", "");
}

module.exports = {
  normalizeUrl,
  awesomeBarToUrl,
  getDisplayUrl
};
