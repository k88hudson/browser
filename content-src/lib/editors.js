const validate = require("lib/validate");
const coerce = require("lib/coerce");

const ArrayEditor = require("components/ArrayEditor");
const ImageDrop = require("components/ImageDrop");
const TextEditor = require("components/TextEditor");
const MarkdownEditor = require("components/MarkdownEditor");

module.exports = {
  list: {
    test: validate.isArray,
    coerce: coerce.array,
    element: ArrayEditor
  },
  image: {
    test: validate.isString,
    coerce: coerce.string,
    element: ImageDrop
  },
  markdown: {
    test: validate.isString,
    coerce: coerce.string,
    element: MarkdownEditor
  },
  text: {
    test: validate.isString,
    coerce: coerce.string,
    element: TextEditor
  },
  default: {
    element: TextEditor
  }
};
