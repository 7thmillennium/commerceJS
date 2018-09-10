exports.up = function (knex, Promise) {
    return Promise.all([
        knex.schema.createTable('articles', function (table) {
            table.increments('id').primary();
            table.string('title').notNullable();
            table.text('text').notNullable();
            table.string('slug').unique();
            table.string('description');
            table.string('feature_img');
            table.dateTime('publish');
            table.dateTime('expire');
            table.integer('views').unsigned().defaultTo(0);
            table.integer('claps').unsigned().defaultTo(0);
            table.integer('user_id').unsigned().notNullable();
            table.foreign('user_id').references('id').inTable('users');
            table.timestamps();
        })
    ]);
};

exports.down = function (knex, Promise) {
    return Promise.all([
        knex.schema.dropTable('articles')
    ])
};
