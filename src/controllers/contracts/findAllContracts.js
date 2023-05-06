// dependency imports
const createError = require("http-errors");

// local imports
const {
  findActiveContractsByProfile,
} = require("../../services/contractService");

module.exports = async function findAllContracts(req, res, next) {
  console.info("findAllContracts");

  const models = req.app.get("models");
  const { id: profileId } = req.profile;

  try {
    const contracts = await findActiveContractsByProfile(profileId, models);
    if (!contracts) {
      return next(createError(404, "Contracts not found"));
    }
    res.json({ contracts });
  } catch (e) {
    next(e);
  }
};
