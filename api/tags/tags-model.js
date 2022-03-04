const db = require('../data/db-config');

const findAll = async () => {
  const rows = await db('tags as t')
  .select(
    't.tag_id',
    't.tag_text as text',
    't.tag_created_at as created_at',
    't.tag_modified_at as modified_at'
  );
  return rows;
}

module.exports = {
  findAll
}