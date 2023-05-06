// dependency imports
const createError = require("http-errors");

// local imports
const { getBestPayingClients } = require("../../services/profileService");

module.exports = async function findBestPayingClients(req, res, next) {
  console.info("findBestPayingClients");

  const models = req.app.get("models");
  const { start, end, limit = 2 } = req.query;

  if (!start || !end) {
    return next(
      createError(400, "Missing required query parameters: start, end")
    );
  }

  try {
    const clients = await getBestPayingClients(start, end, limit, models);
    if (!clients) {
      return next(createError(404, "Clients not found"));
    }

    res.json({ clients });
  } catch (e) {
    next(e);
  }
};
