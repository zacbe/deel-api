// dependency imports

// local imports
const { processJobPaymentById } = require("../../services/jobService");

module.exports = async function payJob(req, res, next) {
  console.info("payJob");

  const models = req.app.get("models");
  const { id: profileId } = req.profile;
  const { job_id: jobId } = req.params;

  try {
    await processJobPaymentById(jobId, profileId, models);
    return res.json({
      message: "Successful Payment",
    });
  } catch (e) {
    next(e);
  }
};
