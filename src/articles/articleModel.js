//https://github.com/edwardhotchkiss/mongoose-paginate -- may need this
'use strict'

const mongoose = require('mongoose')

const ArticleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
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
  text: {
    type: String,
    required: true
  },
  comments: [{
    name: String,
    text: String
  }]
}, {
  timestamps: {}
})

module.exports = mongoose.model('Article', ArticleSchema)
