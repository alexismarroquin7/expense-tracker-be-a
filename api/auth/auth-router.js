const router = require('express').Router();

const {
  validateLoginRequiredFields,
  validateUserExistsByEmail,
  validatePassword,
  handleJsonWebToken,
} = require('./auth-middleware');

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

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;