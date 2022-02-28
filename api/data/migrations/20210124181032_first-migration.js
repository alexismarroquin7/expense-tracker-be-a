exports.up = async (knex) => {
  await knex.schema
  .createTable('roles', (roles) => {
    roles.increments('role_id')
    
    roles.string('role_name')
    .notNullable()
    .unique()
    
    roles.string('role_description', 200)
    
    roles.timestamp('role_created_at')
    .defaultTo(knex.fn.now())
    
    roles.timestamp('role_modified_at')
    .defaultTo(knex.fn.now())
  })
  .createTable('users', (users) => {
    users.increments('user_id')
    
    users.string('email')
    .notNullable()
    .unique()
    
    users.integer('email_confirmed')
    .notNullable()

    users.string('password', 200)
    .notNullable()

    users.integer('role_id')
    .unsigned()
    .notNullable()
    .references('role_id')
    .inTable('roles')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')
    
    users.timestamp('user_created_at')
    .defaultTo(knex.fn.now())
    
    users.timestamp('user_modified_at')
    .defaultTo(knex.fn.now())
  })
  .createTable('tags', (tags) => {
    tags.increments('tag_id')
    
    tags.string('tag_text', 200)
    .notNullable()
    .unique()

    tags.timestamp('tag_created_at')
    .defaultTo(knex.fn.now())
    
    tags.timestamp('tag_modified_at')
    .defaultTo(knex.fn.now())
  })
  .createTable('transaction_types', (transaction_types) => {
    transaction_types.increments('transaction_type_id')
    
    transaction_types.string('transaction_type_name')
    .notNullable()
    .unique()

    transaction_types.timestamp('transaction_type_created_at')
    .defaultTo(knex.fn.now())
    
    transaction_types.timestamp('transaction_type_modified_at')
    .defaultTo(knex.fn.now())
  })
  .createTable('transactions', (transactions) => {
    transactions.increments('transaction_id')
    
    transactions.string('transaction_name')
    
    transactions.string('transaction_description', 200)
    
    transactions.decimal('transaction_amount')
    
    transactions.integer('transaction_date_year')
    
    transactions.integer('transaction_date_month')
    
    transactions.integer('transaction_date_day')

    transactions.integer('user_id')
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')
    
    transactions.integer('transaction_type_id')
    .unsigned()
    .notNullable()
    .references('transaction_type_id')
    .inTable('transaction_types')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')

    transactions.timestamp('transaction_created_at')
    .defaultTo(knex.fn.now())
    
    transactions.timestamp('transaction_modified_at')
    .defaultTo(knex.fn.now())
  })
  .createTable('transaction_tags', transaction_tags => {

    transaction_tags.increments('transaction_tag_id')
    
    transaction_tags.integer('transaction_id')
    .unsigned()
    .notNullable()
    .references('transaction_id')
    .inTable('transactions')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')

    transaction_tags.integer('tag_id')
    .unsigned()
    .notNullable()
    .references('tag_id')
    .inTable('tags')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')
    
    transaction_tags.integer('transaction_tag_index')
    .notNullable()
    
    transaction_tags.timestamp('transaction_tag_created_at')
    .defaultTo(knex.fn.now())
    
    transaction_tags.timestamp('transaction_tag_modified_at')
    .defaultTo(knex.fn.now())
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('transaction_tags')
  await knex.schema.dropTableIfExists('transactions')
  await knex.schema.dropTableIfExists('transaction_types')
  await knex.schema.dropTableIfExists('tags')
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('roles')
}
