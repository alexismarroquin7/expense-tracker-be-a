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

module.exports = {
  handleQuery
}