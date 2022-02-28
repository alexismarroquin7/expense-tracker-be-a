const { roles } = require('../seed-data')

exports.seed = function(knex) {
  return knex('roles').insert(roles);
};