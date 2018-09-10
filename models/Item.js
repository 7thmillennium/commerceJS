var bookshelf = require('../config/bookshelf');

var Item = bookshelf.Model.extend({
  tableName: 'items',
  hasTimestamps: true,
});

module.exports = Item;
