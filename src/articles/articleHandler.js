'use strict'
const Article = require('./articleModel')
const co = require('co-express')

const articleHandler = {
  getAll: co(function*(req, res) {
    const results = yield Article.find().exec()
    if (results) {
      return res.json({
        success: true,
        articles: results
      })
    }
    return res.json({
      success: false,
      articles: []
    })
  }),
  get: co(function*(req, res) {
    const results = yield Article.findOne({
      _id: req.params.id
    }).exec()
    if (results) {
      return res.json({
        success: true,
        articles: results
      })
    }
    return res.json({
      success: false,
      articles: []
    })
  }),
  addComment: co(function*(req, res) {
    const article = yield Article.findOne({
      _id: req.params.id
    }).exec()
    if (article) {
      const comment = {
        name: req.body.name,
        text: req.body.text
      }
      article.comments.push(comment)

      try {
        yield article.save()
      } catch (err) {
        return res.json({
          success: false,
          err: 'Problem saving comment'
        })
      }
      return res.json({
        success: true
      })
    }
  }),
  deleteComment: co(function*(req, res) {
    const article = yield Article.findOne({
      _id: req.params.id
    }).exec()
    if (article) {

      article.comments.pull({
        _id: req.params.commentId
      })

      try {
        yield article.save()
      } catch (err) {
        return res.json({
          success: false,
          err: 'Problem removing comment'
        })
      }
      return res.json({
        success: true
      })
    }
  })
}

module.exports = articleHandler
