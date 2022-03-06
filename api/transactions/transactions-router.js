const router = require('express').Router();
const Transaction = require('./transactions-model');
const { 
  handleQuery,
  validateNewTransactionRequiredFields,
  validateTransactionExistsById
} = require('./transactions-middleware');
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
  restricted,
  validateTransactionExistsById,
  (req, res) => {
  res.status(200).json(req.transaction);
});

router.put(
  '/:transaction_id',
  restricted,
  validateTransactionExistsById,
  validateNewTransactionRequiredFields,
  async (req, res, next) => {
    const { transaction_id } = req.params;

    try {
      const transaction = await Transaction.updateById(
        transaction_id,
        {
          ...req.body,
          user_id: req.decodedToken.subject
        }
      );
      res.status(200).json(transaction);
    } catch (err) {
      next(err);
    }
});

router.post(
  '/', 
  restricted,
  validateNewTransactionRequiredFields,
  async (req, res, next) => {
  try {
    const newTransaction = await Transaction.create({
      ...req.body,
      user_id: req.decodedToken.subject
    });
    res.status(201).json(newTransaction);
  } catch (err) {
    next(err);
  }
})

router.delete(
  '/:transaction_id',
  validateTransactionExistsById, 
  async (req, res, next) => {
    try {
      const deletedTransaction = await Transaction.deleteById(req.transaction.transaction_id);
      res.status(200).json({ transaction_id: deletedTransaction.transaction_id });
    } catch(err) {
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