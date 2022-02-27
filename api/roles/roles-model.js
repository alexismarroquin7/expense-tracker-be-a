const db = require('../data/db-config');


const findAll = async () => {
  const rows = await db('roles as r')
  .select(
    'r.role_id',
    'r.role_name as name',
    'r.role_description as description',
    'r.role_created_at as created_at',
    'r.role_modified_at as modified_at'
  )
  return rows;
}

module.exports = {
  findAll
}