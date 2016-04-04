module.exports = {
  array(value) {
    if (!value) return [];
    if (typeof value === "string") {
      return value.split(/\s*,\s*/);
    }
    return value;
  },
  string(value) {
    if (!value) return "";
    return value;
  }
};
