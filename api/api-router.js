const router = require('express').Router();

const rolesRouter = require('./roles/roles-router');
const usersRouter = require('./users/users-router');

router.use('/roles', rolesRouter);
router.use('/users', usersRouter);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;