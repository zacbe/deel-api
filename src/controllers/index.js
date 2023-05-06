const findOneContract = require("./contracts/findOneContract");
const findAllContracts = require("./contracts/findAllContracts");
const findAllUnpaidJobs = require("./jobs/findAllUnpaidJobs");
const payJob = require("./jobs/payJob");
const updateBalance = require("./profiles/updateBalance");
const findBestPayedProfession = require("./admin/findBestPayedProfession");
const findBestPayingClients = require("./admin/findBestPayingClients");

module.exports = {
  findOneContract,
  findAllContracts,
  findAllUnpaidJobs,
  payJob,
  updateBalance,
  findBestPayedProfession,
  findBestPayingClients,
};
