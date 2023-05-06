// dependency imports
const createError = require("http-errors");

// local imports
const { getBestPayedProfession } = require("../../services/profileService");

module.exports = async function findBestPayedProfession(req, res, next) {
  console.info("findBestPayedProfession");

  const models = req.app.get("models");
  const { start, end } = req.query;

  if (!start || !end) {
    return next(
      createError(400, "Missing required query parameters: start, end")
    );
  }

  try {
    const profession = await getBestPayedProfession(start, end, models);
    if (!profession) {
      return next(createError(404, "No profession found"));
    }
    res.json({ profession });
  } catch (e) {
    next(e);
  }
};
