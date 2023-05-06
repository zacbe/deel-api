const { Op } = require("sequelize");
const { isEmpty } = require("lodash");

/**
 * Find a contract by ID and profile ID.
 *
 * @async
 * @function findContractById
 * @param {number} contractId - The ID of the contract to find.
 * @param {number} profileId - The ID of the profile to use for finding the contract.
 * @param {object} models - The Sequelize models object.
 * @returns {Promise<object>} The contract object if found, or null if not found.
 * @throws {Error} Will throw an error if there is a database error.
 */
async function findContractById(contractId, profileId, models) {
  const { Contract } = models;
  const contract = await Contract.findOne({
    where: {
      id: contractId,
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
    },
    raw: true,
  });

  return isEmpty(contract) ? null : contract;
}

/**
 * Async function to find active contracts for a given profile ID.
 *
 * @async
 * @function findActiveContractsByProfile
 * @param {number} profileId - The ID of the profile to search for active contracts.
 * @param {object} models - The Sequelize models object.
 * @returns {Promise<object[]>} - The array of active contracts for the given profile ID.
 * @throws {Error} - Any database errors that occur during the operation.
 */
async function findActiveContractsByProfile(profileId, models) {
  const { Contract } = models;
  const contracts = await Contract.findAll({
    where: {
      status: { [Op.not]: "terminated" },
      [Op.or]: [{ ClientId: profileId }, { ContractorId: profileId }],
    },
    raw: true,
  });

  return contracts;
}

module.exports = { findContractById, findActiveContractsByProfile };
