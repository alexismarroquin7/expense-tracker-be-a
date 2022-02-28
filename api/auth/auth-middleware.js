const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../../config');

const User = require('../users/users-model');
const { generateJsonWebTokenForUser } = require('../../utils');

const validateLoginRequiredFields = async (req, res, next) => {
  const { email, password } = req.body;  
  if(!email || !password){
    next({
      status: 400,
      message: "email and password are required to login"
    });
  } else {
    next();
  }
}

const validateUserExistsByEmail = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findBy({'u.email': email});
    if(user){
      req.user = user[0];
      next();
    } else {
      next({
        status: 404,
        message: `user does not exist`
      })
    }
  } catch (err) {
    next(err);
  }
}

const validatePassword = async (req, res, next) => {
  const { password } = req.body;
  
  const valid = bcrypt.compareSync(password, req.user.password);
  
  if(valid){
    next();
  
  } else {
    next({
      status: 400,
      message: "incorrect password"
    });
  }
} 

const handleJsonWebToken = (req, res, next) => {
  try {
    const token = generateJsonWebTokenForUser(req.user);
    req.token = token;
    next();
  } catch (err) {
    next(err);
  }
}

const restricted = (req, res, next) => {
  const token = req.headers.authorization;
  if(!token){
   res.status(401).json({ message: 'Token required' });
  } else {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if(err){
        res.status(401).json({ message: "Token invalid"});
      } else {
        req.decodedToken = decoded;
        next();
      }
    });
  }
}

const only = role_name => (req, res, next) => {
  if(req.decodedToken.role_name === role_name){
   next();
  } else {
    res.status(403).json({ message: "This is not for you" });
  }
}


module.exports = {
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJsonWebToken,
  restricted,
  only
}
