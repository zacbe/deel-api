// dependency imports
const createError = require("http-errors");
const { Op } = require("sequelize");
const { isEmpty } = require("lodash");

// local imports
const { substractOp, addOp } = require("../utils/index");

/**
 * Finds all unpaid jobs for a given profile.
 *
 * @async
 * @function findAllUnpaid
 * @param {number} profileId - The ID of the profile to search for unpaid jobs.
 * @param {object} models - The Sequelize models object.
 * @returns {Promise<object[]>} The unpaid jobs found for the given profile.
 * @throws {Error} If there is an error while finding the unpaid jobs.
 */
async function findAllUnpaidJobsByProfile(profileId, models) {
  const { Contract, Job } = models;
  const contracts = await Contract.findAll({
    where: {
      status: "in_progress",
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
    },
    include: {
      model: Job,
      where: { paid: { [Op.is]: null } },
    },
    attributes: [],
  });

  const jobs = contracts.flatMap((contract) =>
    contract.Jobs.map((job) => job.get({ plain: true }))
  );

  return isEmpty(jobs) ? null : jobs;
}

/**
 * Processes the payment for a job by ID
 * @async
 * @function processJobPaymentById
 * @param {number} jobId - The ID of the job to process payment for
 * @param {number} profileId - The ID of the user profile making the payment
 * @param {Object} models - The Sequelize models to use
 * @throws {Error} If the user is invalid or the job has already been paid or the client balance is insufficient
 * @returns {Promise<void>}
 */
async function processJobPaymentById(jobId, profileId, models) {
  const { Job, Contract, Profile } = models;

  // 1. Find job by ID (include related models)
  const job = await Job.findByPk(jobId, {
    include: [
      {
        model: Contract,
        include: [
          { model: Profile, as: "Client" },
          { model: Profile, as: "Contractor" },
        ],
      },
    ],
    lock: true,
  });

  if (!job) {
    throw createError(404, "Job not found");
  }

  if (job.Contract.Client.id !== profileId) {
    throw createError(400, "Invalid user");
  }

  if (job.paid) {
    throw createError(400, "Job has already been paid");
  }

  if (job.Contract.Client.balance < job.price) {
    throw createError(400, "Client balance is insufficient to pay for job");
  }

  // 2. Update the client's balance
  await job.Contract.Client.update({
    balance: substractOp(job.Contract.Client.balance, job.price),
  });

  // 3. Update the contractor's balance
  await job.Contract.Contractor.update({
    balance: addOp(job.Contract.Contractor.balance, job.price),
  });

  // 4. update the job
  await job.update({
    paid: true,
    paymentDate: new Date(),
  });

  // Question: should the contract be updated?
}

module.exports = { findAllUnpaidJobsByProfile, processJobPaymentById };
