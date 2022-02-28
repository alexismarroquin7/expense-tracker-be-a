const router = require('express').Router();
const { restricted, only } = require('../auth/auth-middleware');
const User = require('./users-model');

router.get('/', restricted, only('admin'), async(req, res, next) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
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