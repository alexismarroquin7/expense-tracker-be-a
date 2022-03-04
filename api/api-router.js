const router = require('express').Router();

const rolesRouter = require('./roles/roles-router');
const usersRouter = require('./users/users-router');
const authRouter = require('./auth/auth-router');
const transactionsRouter = require('./transactions/transactions-router');
const tagsRouter = require('./tags/tags-router');

router.use('/roles', rolesRouter);
router.use('/users', usersRouter);
router.use('/auth', authRouter);
router.use('/transactions', transactionsRouter);
router.use('/tags', tagsRouter);

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;