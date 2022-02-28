const { tags } = require('../seed-data')

exports.seed = function(knex) {
  return knex('tags').insert(tags);
};