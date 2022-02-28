const { users } = require('../seed-data')

exports.seed = function(knex) {
  return knex('users').insert(users);
};