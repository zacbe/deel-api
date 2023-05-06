function substractOp(a, b) {
  const res = a - b;
  return res.toFixed(2);
}

function addOp(a, b) {
  const res = a + b;
  return res.toFixed(2);
}

function toUTCDate(dateStr) {
  // Create a new Date object from the input string in the local timezone
  const localDate = new Date(dateStr);

  // Use the UTC methods to get the year, month, and day in UTC time
  const year = localDate.getUTCFullYear();
  const month = localDate.getUTCMonth();
  const day = localDate.getUTCDate();

  // Return a new Date object with the UTC year, month, and day
  return new Date(Date.UTC(year, month, day));
}

module.exports = { substractOp, addOp, toUTCDate };
