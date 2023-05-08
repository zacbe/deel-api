const express = require("express");
const cors = require("cors");
const adminRouter = express.Router();
const { isAdmin, errorHandler } = require("../middleware/index");
const {
  findBestPayedProfession,
  findBestPayingClients,
} = require("../controllers/index");

const corsOptions = {
  origin: "*", // allow all origins
  methods: ["GET", "POST"], // allow only GET and POST requests
  allowedHeaders: ["Content-Type", "profile_id", "x-api-key"], // allow Content-Type and x-api-key headers
};

adminRouter.use(cors(corsOptions));
adminRouter.get(
  "/best-profession",
  isAdmin,
  findBestPayedProfession,
  errorHandler
);
adminRouter.get("/best-clients", isAdmin, findBestPayingClients, errorHandler);

module.exports = adminRouter;
