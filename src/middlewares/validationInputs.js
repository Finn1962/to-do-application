const { validationResult } = require("express-validator");

function validateInputs(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).end();
  }
  next();
}

module.exports = { validateInputs };
