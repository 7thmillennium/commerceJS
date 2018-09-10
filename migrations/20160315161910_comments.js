exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('comments', function (table) {
            table.increments('id').primary();
            table.text('text');
            table.integer('pos').unsigned().defaultTo(0);
            table.integer('neg').unsigned().defaultTo(0);
            table.integer('comment_id').unsigned();
            table.integer('article_id').unsigned().notNullable();
            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('id').inTable('users');
            table.timestamps();
        })
    ]);
};
exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('comments')
    ])
};
