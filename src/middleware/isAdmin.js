// dependency imports

// local imports
const { basic } = require("../../src/config/auth");
const { password } = basic;

module.exports = function isAdmin(req, res, next) {
  const expectedApiKey = password;
  const providedApiKey = req.headers["x-api-key"];

  if (!providedApiKey || providedApiKey !== expectedApiKey) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};
