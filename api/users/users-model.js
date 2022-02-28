const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  
  const users = rows.map(row => {
    return {
      user_id: row.user_id,
      email: row.email,
      password: row.password,
      created_at: row.user_created_at,
      modified_at: row.user_modified_at,
      role: {
        role_id: row.role_id,
        name: row.role_name,
        description: row.role_description,
        created_at: row.role_created_at,
        modified_at: row.role_modified_at
      }
    };
  })

  return users;
}

module.exports = {
  findAll
}