// dependency imports
const createError = require("http-errors");

// local imports
const { findAllUnpaidJobsByProfile } = require("../../services/jobService");

module.exports = async function findAllUnpaidJobs(req, res, next) {
  console.info("findAllUnpaidJobs");

  const models = req.app.get("models");
  const { id: profileId } = req.profile;
  try {
    const jobs = await findAllUnpaidJobsByProfile(profileId, models);
    if (!jobs) {
      return next(createError(404, "No updaid jobs found"));
    }
    res.json({ jobs });
  } catch (e) {
    next(e);
  }
};
