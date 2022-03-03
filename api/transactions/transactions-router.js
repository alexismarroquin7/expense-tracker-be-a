const router = require('express').Router();
const Transaction = require('./transactions-model');
const { handleQuery, validateNewTransactionRequiredFields, validateTransactionExistsById } = require('./transactions-middleware');
const { restricted } = require('../auth/auth-middleware');

router.get('/', restricted, handleQuery, async (req, res, next) => {
  try {
    const transactions = await Transaction.findAll();
    res.status(200).json(transactions);
  } catch (err) {
    next(err);
  }
});

router.get(
  '/:transaction_id',
  validateTransactionExistsById, 
  (req, res) => {
  console.log('over here')
  res.status(200).json(req.transaction);
});

router.post(
  '/', 
  validateNewTransactionRequiredFields,
  async (req, res, next) => {
  try {
    const newTransaction = await Transaction.create(req.body);
    res.status(200).json(newTransaction);
  } catch (err) {
    next(err);
  }
})

router.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status||500).json({
    message: err.message,
    stack: err.stack
  })
});

module.exports = router;