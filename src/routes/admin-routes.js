const express = require("express");
const adminRouter = express.Router();
const { isAdmin, errorHandler } = require("../middleware/index");
const {
  findBestPayedProfession,
  findBestPayingClients,
} = require("../controllers/index");

adminRouter.get(
  "/best-profession",
  isAdmin,
  findBestPayedProfession,
  errorHandler
);
adminRouter.get("/best-clients", isAdmin, findBestPayingClients, errorHandler);

module.exports = adminRouter;
