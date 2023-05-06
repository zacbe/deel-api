// dependency imports
const createError = require("http-errors");

// local imports
const { updateClientBalance } = require("../../services/profileService");

module.exports = async function updateBalance(req, res, next) {
  console.info("updateProfileBalance");

  const models = req.app.get("models");
  const { id: profileId } = req.profile;
  const { userId } = req.params;
  const depositAmount = parseInt(req.body.amount, 10);

  try {
    // profileId and userId should match?
    if (profileId.toString() !== userId) {
      return next(createError(400, "Invalid user"));
    }

    await updateClientBalance(userId, depositAmount, models);
    return res.json({
      message: "Successful Deposit",
    });
  } catch (e) {
    next(e);
  }
};
