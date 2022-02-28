const db = require('../data/db-config');
const { intToBool } = require('../../utils');

const formatRows = (
  rows,
  query = {}
) => {

  const uniqueTransactionIds = [...new Set(rows.map(row => row.transaction_id))];

  const transactions = uniqueTransactionIds.map(uniqueTransactionId => {
    let transaction = {
      user: { role: {} },
      transaction_type: {}
    };

    const matchingTransactions = rows.filter(row => row.transaction_id === uniqueTransactionId);

    const tags = matchingTransactions.map(matchingTransaction => {
      if(!transaction.transaction_id){
        transaction.transaction_id = matchingTransaction.transaction_id;
        transaction.name = matchingTransaction.transaction_name;
        transaction.description = matchingTransaction.transaction_description;
        transaction.amount = matchingTransaction.transaction_amount;
        transaction.date_year = matchingTransaction.transaction_date_year;
        transaction.date_month = matchingTransaction.transaction_date_month;
        transaction.date_day = matchingTransaction.transaction_date_day;
        transaction.created_at = matchingTransaction.transaction_created_at;
        transaction.modified_at = matchingTransaction.transaction_modified_at;

        transaction.user.user_id = matchingTransaction.user_id;
        transaction.user.email = matchingTransaction.email;
        transaction.user.email_confirmed = intToBool(matchingTransaction.email_confirmed);
        transaction.user.password = matchingTransaction.password;
        transaction.user.created_at = matchingTransaction.user_created_at;
        transaction.user.modified_at = matchingTransaction.user_modified_at;
        
        transaction.user.role.role_id = matchingTransaction.role_id;
        transaction.user.role.name = matchingTransaction.role_name;
        transaction.user.role.description = matchingTransaction.role_description;
        transaction.user.role.created_at = matchingTransaction.role_created_at;
        transaction.user.role.modified_at = matchingTransaction.role_modified_at;

        transaction.transaction_type.transaction_type_id = matchingTransaction.transaction_type_id;
        transaction.transaction_type.name = matchingTransaction.transaction_type_name;
        transaction.transaction_type.created_at = matchingTransaction.transaction_type_created_at;
        transaction.transaction_type.modified_at = matchingTransaction.transaction_type_modified_at;
      }

      return {
        tag_id: matchingTransaction.tag_id,
        text: matchingTransaction.tag_text,
        index: matchingTransaction.transaction_tag_index,
        created_at: matchingTransaction.tag_created_at,
        modified_at: matchingTransaction.tag_modified_at,
      }
    })

    return {
      ...transaction,
      tags: tags.sort((a, b) => a.index - b.index) // sort asc by index
    };

  });

  let transactionsToUse;

  let queryToUse = {
    sortBy: query.sortBy ? query.sortBy : 'transaction_id',
    dir: query.dir ? query.dir : 'asc'
  }

  const validQuery = () => {
    const validSortBy = new Set([
      'date',
      'transaction_id'
    ]);
    
    const validDir = new Set([
      'asc',
      'desc'
    ])

    if(validSortBy.has(queryToUse.sortBy) && validDir.has(queryToUse.dir)){
      return true;
    } else {
      return false;
    }
  }

  if(!validQuery()) throw Error('invalid query params');
  
  if(queryToUse.sortBy === 'date'){
    if(queryToUse.dir === 'asc'){
      transactionsToUse = transactions.sort((a,b) => new Date(a.date_year, a.date_month, a.date_day) - new Date(b.date_year, b.date_month, b.date_day));
    } else if(queryToUse.dir === 'desc') {
      transactionsToUse = transactions.sort((a,b) => new Date(b.date_year, b.date_month, b.date_day) - new Date(a.date_year, a.date_month, a.date_day));
    }
  } else if(queryToUse.sortBy === 'transaction_id'){
    if(queryToUse.dir === 'asc'){
      transactionsToUse = transactions.sort((a,b) => a.transaction_id - b.transaction_id);
    } else if(queryToUse.dir === 'desc') {
      transactionsToUse = transactions.sort((a,b) => b.transaction_id - a.transaction_id);
    }
  }
  
  return transactionsToUse;

}

const findAll = async () => {
  const rows = await db('transactions as tran')
  .join('users as u', 'u.user_id', 'tran.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .join('transaction_types as t_type', 't_type.transaction_type_id', 'tran.transaction_type_id')
  .join('transaction_tags as t_tag', 't_tag.transaction_id', 'tran.transaction_id')
  .join('tags as tag', 'tag.tag_id', 't_tag.tag_id')
  
  const transactions = formatRows(rows);

  return transactions;
}

const findByUserId = async (user_id, query) => {
  const rows = await db('transactions as tran')
  .join('users as u', 'u.user_id', 'tran.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .join('transaction_types as t_type', 't_type.transaction_type_id', 'tran.transaction_type_id')
  .join('transaction_tags as t_tag', 't_tag.transaction_id', 'tran.transaction_id')
  .join('tags as tag', 'tag.tag_id', 't_tag.tag_id')
  .where({'u.user_id': user_id});

  const transactions = formatRows(rows, query);

  return transactions;
}

module.exports = {
  findAll,
  findByUserId
}