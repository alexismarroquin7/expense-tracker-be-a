const User = require('../users/users-model');
const Transaction = require('./transactions-model');
const { isEmptyObj } = require("../../utils");

const handleQuery = async (req, res, next) => {
  // if there are no queries continue to the next middleware
  if(isEmptyObj(req.query)){
    next();
  
  } else {
    // if there is a query
    // check if there is a valid query

    // if there is a user_id query check if the user exists
    if(req.query.user_id){
      const user = await User.findBy({'u.user_id': Number(req.query.user_id) }); // returns list with one item if found
      
      if(user){ // if found query transactions by user_id
        try {
          const transactions = await Transaction.findByUserId(user[0].user_id, req.query);
          res.status(200).json(transactions);
        } catch(err) {
          next(err);
        }

      } else { // if the user is not found return error message
        next({
          status: 404,
          message: `user of id ${Number(req.query.user_id)} does not exist`
        });
      }
    
    } else { // if query does not match any "if" statement respond with "invalid query params"
      next({
        status: 404,
        message: `invalid query params`
      });
    }
  }
};

const validateNewTransactionRequiredFields = (req, res, next) => {
  const { name, amount, date, type, tags } = req.body;
  
  const validTags = (tagList) => {
    let validTagList = true;

    tagList.forEach(tagItem => {
      if(
        !(typeof tagItem.index === 'number') ||
        !(typeof tagItem.text === 'string')
      ){
        validTagList = false;
      }

    });

    return validTagList;
  }

  const valid = {
    name: typeof name === 'string' && name.length > 0,
    
    amount: typeof amount === 'number',
    
    date: typeof date === 'object' &&
    !isEmptyObj(date) &&
    date.year &&
    typeof date.year === 'number' &&
    date.month &&
    typeof date.month === 'number' &&
    date.day &&
    typeof date.day === 'number',
    
    type: typeof type === 'string' &&
    type === ('deposit' || 'widthdrawl'),

    tags: Array.isArray(tags) && validTags(tags)
  }

  if(
    valid.name &&
    valid.amount &&
    valid.date &&
    valid.type &&
    valid.tags
  ){
    next();
  } else {
    next({
      status: 400,
      message: 'new transaction missing required fields'
    });
  }
}

const validateTransactionExistsById = async (req, res, next) => {
  const { transaction_id } = req.params;
  try {
    const transaction = await Transaction.findById(transaction_id);
    if(transaction){
      req.transaction = transaction;
      next();
    } else {
      next({
        status: 404,
        message: `transaction does not exist`
      })
    }
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleQuery,
  validateNewTransactionRequiredFields,
  validateTransactionExistsById
}