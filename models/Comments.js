var bookshelf = require('../config/bookshelf');

var Comments = bookshelf.Model.extend({
    tableName: 'comments',
    hasTimestamps: true,

    initialize: function () {
        // this.on('saving', this.hashPassword, this);
    },
});

module.exports = Comments;
