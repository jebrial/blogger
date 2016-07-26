//https://github.com/edwardhotchkiss/mongoose-paginate -- may need this
'use strict'

const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true
  },
  authorName: {
    type: String,
    required: true
  },
  authorEmail: {
    type: String,
    required: true,
    lowercase: true
  },
  body: {
    type: String,
    required: true
  },
  comments: [{
    name: String,
    body: String
  }]
}, {
  timestamps: {}
})

module.exports = mongoose.model('Article', ArticleSchema)
