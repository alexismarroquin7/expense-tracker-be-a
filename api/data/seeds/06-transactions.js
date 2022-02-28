const { transactions } = require('../seed-data')

exports.seed = function(knex) {
  return knex('transactions').insert(transactions);
};