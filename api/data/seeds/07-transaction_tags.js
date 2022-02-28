const { transaction_tags } = require('../seed-data')

exports.seed = function(knex) {
  return knex('transaction_tags').insert(transaction_tags);
};