const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config');

function generateJsonWebToken(payload, options){
  const token = jwt.sign(payload, JWT_SECRET, options);
  return token;
}

function generateJsonWebTokenForUser(user){
  const { user_id } = user;
  
  const payload = {
    subject: user_id,
    email: user.email,
    role: { 
      role_id: user.role.role_id,
      name: user.role.name 
    }
  };

  const options = {
    expiresIn: '1d'
  };

  const token = generateJsonWebToken(payload, options);
  
  return token;
}

module.exports = {
  generateJsonWebTokenForUser,
  generateJsonWebToken
}