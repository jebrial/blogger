'use strict';
const mongoose = require('mongoose')
const Article = mongoose.model('Article')
const User = mongoose.model('User')

module.exports = function(t) {
  User.remove();
  Article.remove()
  t.end()
}
