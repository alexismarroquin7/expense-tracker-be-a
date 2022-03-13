const router = require('express').Router();
const User = require('../users/users-model');

const {
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJsonWebToken,
  validateUserNotExistsByEmail,
  validateNewUserRequiredFields,
  handlePasswordHash,
  selectRoleForNewUser,
  restricted
} = require('./auth-middleware');

const {
  sendMail,
  generateJsonWebToken
} = require('../../utils');

router.post('/login',
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJsonWebToken,
  (req, res) => {
    res
    .status(200)
    .json({
      message: `welcome back, ${req.user.email}`,
      user: req.user,
      token: req.token
    })
});

router.post('/request-register', validateUserNotExistsByEmail, async(req, res, next) => {

  const { email } = req.body;
  
  const token = generateJsonWebToken({ subject: email }, { expiresIn: '1d' });

  try {
    await sendMail(
      {
        service: "gmail",
        auth: {
          user: process.env.SUPPORT_EMAIL_USER,
          pass: process.env.SUPPORT_EMAIL_PASS
        }
      },
      {
        from: process.env.SUPPORT_EMAIL_USER,
        to: req.body.email,
        subject: '[ expense tracker - confirm email ]',
        text: `confirm email at the following link ${process.env.NODE_ENV === 'development' ? process.env.REACT_APP_LOCAL_CLIENT_URL : process.env.REACT_APP_PRODUCTION_CLIENT_URL}/auth/sign-up?token=${token}`
      }
    );
    res.status(200).json({ message: 'email sent!' });

  } catch (err) {
    next(err);
  }
});

router.post('/register', 
  restricted,
  validateNewUserRequiredFields,
  validateUserNotExistsByEmail,
  handlePasswordHash,
  selectRoleForNewUser, 
  async (req, res, next) => {

    try {
      const user = await User.create({
        email: req.decodedToken.subject,
        email_confirmed: 1,
        password: req.hash,
        role_id: req.role.role_id
      });

      res.status(200).json(user);
      
    } catch (err) {
      next(err);
    }
});

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;