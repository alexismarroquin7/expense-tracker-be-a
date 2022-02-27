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
  .createTable('expense_types', (expense_types) => {
    expense_types.increments('expense_type_id')
    
    expense_types.string('expense_type_name')
    .notNullable()
    .unique()

    expense_types.timestamp('expense_type_created_at')
    .defaultTo(knex.fn.now())
    
    expense_types.timestamp('expense_type_modified_at')
    .defaultTo(knex.fn.now())
  })
  .createTable('expenses', (expenses) => {
    expenses.increments('expense_id')
    
    expenses.string('expense_name')
    
    expenses.string('expense_description', 200)
    
    expenses.decimal('expense_amount')
    
    expenses.integer('expense_date_year')
    
    expenses.integer('expense_date_month')
    
    expenses.integer('expense_date_day')

    expenses.integer('user_id')
    .unsigned()
    .notNullable()
    .references('user_id')
    .inTable('users')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')
    
    expenses.integer('expense_type_id')
    .unsigned()
    .notNullable()
    .references('expense_type_id')
    .inTable('expense_types')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')

    expenses.timestamp('expense_created_at')
    .defaultTo(knex.fn.now())
    
    expenses.timestamp('expense_modified_at')
    .defaultTo(knex.fn.now())
  })
  .createTable('expense_tags', expense_tags => {

    expense_tags.increments('expense_tag_id')
    
    expense_tags.integer('expense_id')
    .unsigned()
    .notNullable()
    .references('expense_id')
    .inTable('expenses')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')

    expense_tags.integer('tag_id')
    .unsigned()
    .notNullable()
    .references('tag_id')
    .inTable('tags')
    .onUpdate('CASCADE')
    .onDelete('RESTRICT')
    
    expense_tags.integer('expense_tag_position')
    
    expense_tags.timestamp('expense_tag_created_at')
    .defaultTo(knex.fn.now())
    
    expense_tags.timestamp('expense_tag_modified_at')
    .defaultTo(knex.fn.now())
  })
}

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists('expense_tags')
  await knex.schema.dropTableIfExists('expenses')
  await knex.schema.dropTableIfExists('expense_types')
  await knex.schema.dropTableIfExists('tags')
  await knex.schema.dropTableIfExists('users')
  await knex.schema.dropTableIfExists('roles')
}
