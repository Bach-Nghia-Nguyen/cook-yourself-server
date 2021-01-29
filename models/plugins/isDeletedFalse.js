// const { modelName } = require("../User");

module.exports = exports = isDeletedFalse = function (schema, options) {
  schema.pre(/^find/, function (next) {
    if (this._conditions["isDeleled"] === undefined)
      this._conditions["isDeleted"] = false;
    next();
  });
};