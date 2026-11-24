const { validationResult } = require("express-validator");
const ApiError = require("../utils/ApiError");

function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const err = new ApiError(400, "Validation failed");
    err.errors = errors.array();
    return next(err);
  }
  next();
}

module.exports = validate;
