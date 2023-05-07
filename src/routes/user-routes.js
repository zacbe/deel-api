const express = require("express");
const cors = require("cors");
const userRouter = express.Router();
const { getProfile, errorHandler } = require("../middleware/index");
const {
  findOneContract,
  findAllContracts,
  findAllUnpaidJobs,
  payJob,
  updateBalance,
} = require("../controllers/index");

const corsOptions = {
  origin: "*", // allow all origins
  methods: ["GET", "POST"], // allow only GET and POST requests
  allowedHeaders: ["Content-Type"], // allow Content-Type and x-api-key headers
};

userRouter.use(cors(corsOptions));
userRouter.get("/contracts/:id", getProfile, findOneContract, errorHandler);
userRouter.get("/contracts", getProfile, findAllContracts, errorHandler);
userRouter.get("/jobs/unpaid", getProfile, findAllUnpaidJobs, errorHandler);
userRouter.post("/jobs/:job_id/pay", getProfile, payJob, errorHandler);
userRouter.post(
  "/balances/deposit/:userId",
  getProfile,
  updateBalance,
  errorHandler
);

module.exports = userRouter;
