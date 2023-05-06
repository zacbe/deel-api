// dependency imports
const createError = require("http-errors");

// local imports
const { findContractById } = require("../../services/contractService");

module.exports = async function findOneContract(req, res, next) {
  console.info("findOneContract");

  const models = req.app.get("models");
  const { id } = req.params;
  const { id: profileId } = req.profile;

  try {
    const contract = await findContractById(id, profileId, models);
    if (!contract) {
      return next(createError(404, "Contract not found"));
    }
    res.json({ contract });
  } catch (e) {
    next(e);
  }
};
