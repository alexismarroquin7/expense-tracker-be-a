const { transaction_types } = require('../seed-data')

exports.seed = function(knex) {
  return knex('transaction_types').insert(transaction_types);
};