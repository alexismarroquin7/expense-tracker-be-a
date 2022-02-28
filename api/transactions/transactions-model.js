const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('transactions as t')
  return rows;
}

module.exports = {
  findAll
}