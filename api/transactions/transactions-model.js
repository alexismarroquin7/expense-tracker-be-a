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
        transaction.amount = Number(matchingTransaction.transaction_amount);
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
      tags: tags
      .filter(tag => tag.tag_id !== null) // removes tags where transaction has no tags
      .sort((a, b) => a.index - b.index) // sort asc by index
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
  .leftJoin('transaction_tags as t_tag', 't_tag.transaction_id', 'tran.transaction_id')
  .leftJoin('tags as tag', 'tag.tag_id', 't_tag.tag_id')
  .select(
    'tran.transaction_id',
    'tran.transaction_name',
    'tran.transaction_description',
    'tran.transaction_amount',
    'tran.transaction_date_year',
    'tran.transaction_date_month',
    'tran.transaction_date_day',
    'tran.transaction_created_at',
    'tran.transaction_modified_at',

    'u.user_id',
    'u.email',
    'u.email_confirmed',
    'u.password',
    'u.user_created_at',
    'u.user_modified_at',
    
    'r.role_id',
    'r.role_name',
    'r.role_description',
    'r.role_created_at',
    'r.role_modified_at',

    't_type.transaction_type_id',
    't_type.transaction_type_name',
    't_type.transaction_type_created_at',
    't_type.transaction_type_modified_at',
    
    't_tag.transaction_tag_id',
    't_tag.transaction_tag_index',
    't_tag.transaction_tag_created_at',
    't_tag.transaction_tag_modified_at',
    
    'tag.tag_id',
    'tag.tag_text',
    'tag.tag_created_at',
    'tag.tag_modified_at'
    
  )
  
  const transactions = formatRows(rows);

  return transactions;
}

const findByUserId = async (user_id, query) => {
  const rows = await db('transactions as tran')
  .join('users as u', 'u.user_id', 'tran.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .join('transaction_types as t_type', 't_type.transaction_type_id', 'tran.transaction_type_id')
  .leftJoin('transaction_tags as t_tag', 't_tag.transaction_id', 'tran.transaction_id')
  .leftJoin('tags as tag', 'tag.tag_id', 't_tag.tag_id')
  .where({'u.user_id': user_id})
  .select(
    'tran.transaction_id',
    'tran.transaction_name',
    'tran.transaction_description',
    'tran.transaction_amount',
    'tran.transaction_date_year',
    'tran.transaction_date_month',
    'tran.transaction_date_day',
    'tran.transaction_created_at',
    'tran.transaction_modified_at',

    'u.user_id',
    'u.email',
    'u.email_confirmed',
    'u.password',
    'u.user_created_at',
    'u.user_modified_at',
    
    'r.role_id',
    'r.role_name',
    'r.role_description',
    'r.role_created_at',
    'r.role_modified_at',

    't_type.transaction_type_id',
    't_type.transaction_type_name',
    't_type.transaction_type_created_at',
    't_type.transaction_type_modified_at',
    
    't_tag.transaction_tag_id',
    't_tag.transaction_tag_index',
    't_tag.transaction_tag_created_at',
    't_tag.transaction_tag_modified_at',
    
    'tag.tag_id',
    'tag.tag_text',
    'tag.tag_created_at',
    'tag.tag_modified_at'
    
  );

  const transactions = formatRows(rows, query);

  return transactions;
}

const create = async (newTransaction) => {
  /*
    model:

    {
      name: 'hello',
      description: 'world',
      amount: 12.32,
      type: 'deposit',
      date: {
        year: 2022,
        month: 3,
        day: 2
      },
      tags: [
        {
          index: 0,
          text: 'personal'
        },
        {
          index: 1,
          text: 'clothes'
        }
      ]
    }

    steps:

    [x] find user_id to use
    [x] find transaction_type_id to use
    [ ] for each tag
      [ ] check if tag text exists
        [ ] if does not exist
          [ ] create new tag

        [ ] if does exist
          [ ] get tag id
      
      [ ] insert tag_id, tag index, and transaction id to transaction_tags table
  
  */

  
  // find transaction_type_id to use
  const transaction_type = await db('transaction_types as t_type')
  .where({
    't_type.transaction_type_name': newTransaction.type
  })
  .first();

  const transaction_type_id_to_use = transaction_type.transaction_type_id;

  // create new transaction
  const [transaction] =  await db('transactions as tran')
  .insert({
    transaction_name: newTransaction.name,
    transaction_description: newTransaction.description || null,
    transaction_amount: newTransaction.amount,
    transaction_date_year: newTransaction.date.year,
    transaction_date_month: newTransaction.date.month,
    transaction_date_day: newTransaction.date.day,
    transaction_type_id: transaction_type_id_to_use,
    user_id: newTransaction.user_id
  }, ['tran.transaction_id']);

  // insert tags
  await newTransaction.tags.forEach(async tag => {
    
    let tag_id_to_use;
    
    // check if tag already exists
    const tagFound = await db('tags as t')
    .where({ 't.tag_text': tag.text })
    .first();

    // if tag exists use existing tag_id
    if(tagFound){
      tag_id_to_use = tagFound.tag_id
    
    } else {
      // if tag DOES NOT exist create new tag
      const [newTag] = await db('tags as t')
      .insert({
        tag_text: tag.text 
      }, ['t.tag_id']);

      tag_id_to_use = newTag.tag_id
    }

    await db('transaction_tags as t_tags')
    .insert({
      transaction_tag_index: tag.index,
      tag_id: tag_id_to_use,
      transaction_id: transaction.transaction_id
    })
    
  });
  
  

  return findById(transaction.transaction_id);
}

const findById = async (transaction_id) => {
  const transactionFound = await db('transactions as tran')
  .where({ 'tran.transaction_id': transaction_id })
  .first()

  if(!transactionFound) return null;

  const rows = await db('transactions as tran')
  .join('users as u', 'u.user_id', 'tran.user_id')
  .join('roles as r', 'r.role_id', 'u.role_id')
  .join('transaction_types as t_type', 't_type.transaction_type_id', 'tran.transaction_type_id')
  .leftJoin('transaction_tags as t_tag', 't_tag.transaction_id', 'tran.transaction_id')
  .leftJoin('tags as tag', 'tag.tag_id', 't_tag.tag_id')
  .where({ 'tran.transaction_id': transaction_id })
  .select(
    'tran.transaction_id',
    'tran.transaction_name',
    'tran.transaction_description',
    'tran.transaction_amount',
    'tran.transaction_date_year',
    'tran.transaction_date_month',
    'tran.transaction_date_day',
    'tran.transaction_created_at',
    'tran.transaction_modified_at',

    'u.user_id',
    'u.email',
    'u.email_confirmed',
    'u.password',
    'u.user_created_at',
    'u.user_modified_at',
    
    'r.role_id',
    'r.role_name',
    'r.role_description',
    'r.role_created_at',
    'r.role_modified_at',

    't_type.transaction_type_id',
    't_type.transaction_type_name',
    't_type.transaction_type_created_at',
    't_type.transaction_type_modified_at',
    
    't_tag.transaction_tag_id',
    't_tag.transaction_tag_index',
    't_tag.transaction_tag_created_at',
    't_tag.transaction_tag_modified_at',
    
    'tag.tag_id',
    'tag.tag_text',
    'tag.tag_created_at',
    'tag.tag_modified_at'
    
  )

  const [transactionItem] = formatRows(rows);

  return transactionItem;

}

const deleteById = async (transaction_id) => {
  
  // find transaction that will be deleted
  const transactionToDelete = await findById(transaction_id);

  // delete transaction_tags where transaction_id === transactionToDelete.transaction_id
  await db('transaction_tags as t_tag')
  .where({ 't_tag.transaction_id': transactionToDelete.transaction_id })
  .delete();

  // check if any other transaction uses tags 
  // that were used by the transactionToDelete
  await transactionToDelete.tags.forEach(async tag => {
    const transactionTagFound = await db('transaction_tags as t_tag')
    .where({ 't_tag.tag_id': tag.tag_id })
    .first();

    // if no other transaction is using this tag
    // delete the tag by id
    if(!transactionTagFound){
      await db('tags as t')
      .where({ 't.tag_id': tag.tag_id })
      .delete()
    }

  });

  await db('transactions as tran')
  .where({ 'tran.transaction_id': transactionToDelete.transaction_id })
  .delete()

  return transactionToDelete;
}

module.exports = {
  findAll,
  findByUserId,
  create,
  findById,
  deleteById
}