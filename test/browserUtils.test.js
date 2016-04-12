const assert = require("chai").assert;
const browserUtils = require("../common/browserUtils");
const normalizeUrl = browserUtils.normalizeUrl;
const awesomeBarToUrl = browserUtils.awesomeBarToUrl;

describe("normalizeUrl", () => {
  it("should leave a well-formed url unchanged", () => {
    assert.equal(normalizeUrl("https://foo.com"), "https://foo.com");
  });
  it("should normalize a trailing slash", () => {
    assert.equal(normalizeUrl("https://foo.com"), "https://foo.com");
    assert.equal(normalizeUrl("https://foo.com/hello/world/"), "https://foo.com/hello/world");
    assert.equal(normalizeUrl("https://foo.com/hello/world/?blah=1"), "https://foo.com/hello/world?blah=1");
  });
  it("should not normalize a trailing slash in a query string or hash", () => {
    assert.equal(normalizeUrl("https://foo.com?blah=1/"), "https://foo.com?blah=1/");
    assert.equal(normalizeUrl("https://foo.com#blah/"), "https://foo.com#blah/");
  });
});

describe("awesomeBarToUrl", () => {
  it("should add http if protocol is missing", () => {
    assert.equal(awesomeBarToUrl("foo.com"), "http://foo.com");
  });
  it("should work with localhost", () => {
    assert.equal(awesomeBarToUrl("localhost:1963"), "http://localhost:1963");
  });
  it("should create a search if a space or a single word is entered", () => {
    assert.equal(awesomeBarToUrl("foo"), "https://google.com?gws_rd=ssl#q=foo");
    assert.equal(awesomeBarToUrl("foo bar"), "https://google.com?gws_rd=ssl#q=foo%20bar");
  });
});
