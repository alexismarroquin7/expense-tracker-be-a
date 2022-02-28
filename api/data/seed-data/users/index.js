const bcrypt = require('bcryptjs');

const rounds = process.env.DB_ROUNDS 
? Number(process.env.DB_ROUNDS) 
: 8;

const userPassword = process.env.TEST_USER_PASSWORD || '1234';
const hash = bcrypt.hashSync(userPassword, rounds);

const users = [
  {
    email: 'lee@gmail.com',
    email_confirmed: 1,
    password: hash,
    role_id: 1
  },
  {
    email: 'carter@gmail.com',
    email_confirmed: 1,
    password: hash,
    role_id: 1
  },
  {
    email: 'thomas@gmail.com',
    email_confirmed: 1,
    password: hash,
    role_id: 2
  },
  {
    email: 'roger@gmail.com',
    email_confirmed: 1,
    password: hash,
    role_id: 2
  }
]

module.exports = users;