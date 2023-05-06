// dependency imports
const createError = require("http-errors");
const { get } = require("lodash");
const { Op, fn, col, literal } = require("sequelize");

// local imports
const { toUTCDate } = require("../utils/index");

/**
 * Updates the balance of a client's profile by depositing a certain amount of money.
 * @async
 * @function updateClientBalance
 * @param {string} userId - The ID of the client's profile.
 * @param {number} depositAmount - The amount of money to deposit.
 * @param {object} models - The Sequelize models object.
 * @throws {Error} If the total price of in-progress jobs for the client cannot be retrieved.
 * @throws {Error} If the deposit amount exceeds 25% of the total job price.
 * @returns {Promise<void>} A Promise that resolves when the balance has been updated successfully.
 */
async function updateClientBalance(userId, depositAmount, models) {
  const { Contract, Job, Profile } = models;
  const contracts = await Contract.findAll({
    where: {
      status: "in_progress",
      ClientId: userId,
    },
    include: {
      model: Job,
      where: { paid: { [Op.is]: null } },
      attributes: [[fn("SUM", col("price")), "totalPrice"]],
    },
    attributes: [], // exclude fields from Contract model
    raw: true,
  });

  const totalPrice = get(contracts, `[0]["Jobs.totalPrice"]`, null);
  if (!totalPrice) throw createError(400, "Could not determine a total");

  if (depositAmount > totalPrice * 0.25) {
    throw createError(400, "Deposit amount exceeds 25% of total job price");
  }

  await Profile.update(
    {
      balance: literal(`COALESCE(balance, 0) + ${depositAmount}`),
    },
    { where: { id: userId, type: "client" } }
  );
}

/**
 * Returns the profession that earned the most money in the query time range
 *
 * @async
 * @function getBestPayedProfession
 * @param {string} start - Start date of the time range in ISO format (yyyy-mm-dd).
 * @param {string} end - End date of the time range in ISO format (yyyy-mm-dd).
 * @param {object} models - The Sequelize models object.
 * @returns {Promise<string|null>} - Resolves with a profession or a null value
 * @throws {Error} - If an error occurs while retrieving the data.
 */
async function getBestPayedProfession(start, end, models) {
  const { Profile, Contract, Job } = models;

  const profiles = await Profile.findAll({
    where: {
      type: "contractor",
    },
    attributes: [
      "profession",
      "firstName",
      [fn("SUM", col("Contractor.Jobs.price")), "totalPaid"],
    ],
    include: [
      {
        model: Contract,
        as: "Contractor",
        where: {
          status: "terminated",
          updatedAt: {
            [Op.between]: [toUTCDate(start), toUTCDate(end)],
          },
        },
        include: [
          {
            model: Job,
            as: "Jobs",
            attributes: [],
          },
        ],
      },
    ],
    group: ["Profile.profession"],
    order: [[literal("totalPaid"), "DESC"]],
  });

  const profession = get(profiles, "[0].profession", null);
  return profession;
}

async function getBestPayingClients(start, end, limit, models) {
  const { Profile, Contract, Job } = models;

  const profiles = await Profile.findAll({
    where: {
      type: "client",
    },
    attributes: [
      "id",
      [literal(`firstName || ' ' || lastName`), "fullName"],
      [fn("COALESCE", fn("SUM", col("Client.Jobs.price")), 0), "paid"],
    ],
    include: [
      {
        model: Contract,
        as: "Client",
        where: {
          status: "terminated",
          updatedAt: {
            [Op.between]: [toUTCDate(start), toUTCDate(end)],
          },
        },
        include: [
          {
            model: Job,
            as: "Jobs",
            attributes: [],
          },
        ],
      },
    ],
    group: ["Profile.id"],
    order: [[literal("paid"), "DESC"]],
    raw: true,
  });

  return profiles
    .map(({ id, fullName, paid }) => ({
      id,
      fullName,
      paid,
    }))
    .splice(0, limit);
}

module.exports = {
  updateClientBalance,
  getBestPayedProfession,
  getBestPayingClients,
};
