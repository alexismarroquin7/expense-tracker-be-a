const bcrypt = require('bcryptjs');
const User = require('../users/users-model');
const { generateJsonWebTokenForUser } = require('../../utils');

const validateLoginRequiredFields = async (req, res, next) => {
  const { email, password } = req.body;  
  console.log(email, password)
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

module.exports = {
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJsonWebToken
}
