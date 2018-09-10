exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('items', function(table) {
      table.increments();
      table.string('name');
      table.text('info');
      table.string('type');
      table.string('category');
      table.integer('price').unsigned().defaultTo(0);
      table.string('social_link');
      table.integer('like').unsigned().defaultTo(0);
      table.integer('views').unsigned().defaultTo(0);
      table.integer('user_id').unsigned().notNullable();
      table.foreign('user_id').references('id').inTable('users');
      table.timestamps();
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('items')
  ])
};
