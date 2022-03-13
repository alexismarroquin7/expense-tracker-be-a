const db = require('../data/db-config');
const { intToBool } = require('../../utils');

const findAll = async () => {
  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  
  const users = rows.map(row => {
    return {
      user_id: row.user_id,
      email: row.email,
      email_confirmed: intToBool(row.email_confirmed),
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

const findBy = async (filter) => {
  const rows = await db('users as u')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .where(filter)
  
  let users = null;

  if(rows && Array.isArray(rows) && rows.length > 0){
    users = rows.map(row => {
      return {
        user_id: row.user_id,
        email: row.email,
        email_confirmed: intToBool(row.email_confirmed),
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
  } 
  
  return users;
}

const create = async (user) => {
  const [newUser] = await db('users as u')
  .insert({
    email: user.email,
    email_confirmed: user.email_confirmed,
    password: user.password,
    role_id: user.role_id
  }, ['u.user_id'])

  const [newUserToUse] = await findBy({ 'u.user_id': newUser.user_id });
  
  return newUserToUse;
}

module.exports = {
  findAll,
  findBy,
  create
}