/**
 * ----------------------------------------
 * Basic Auth Config
 * ----------------------------------------
 */
const basic = Object.freeze({
  password: process.env.AUTH_BASIC_PASSWORD,
});

module.exports = {
  basic,
};
