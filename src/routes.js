'use strict'
const protectedApi = require('express').Router()
const publicApi = require('express').Router()
const UserHandler = require('./users/userHandler')
const ArticleHandler = require('./articles/articleHandler')
// ---- Public Routes ----------------------------------

/**
 * @api {post} /signup Add a User
 * @apiName addUser
 * @apiGroup User
 *
 * @apiParam {Object} user New User.
 *
 * @apiSuccess {Object[]} Returns a User object with a new auth token.
 */
publicApi.post('/signup', UserHandler.add)

/**
 * @api {post} /login Add a User
 * @apiName loginUser
 * @apiGroup User
 *
 * @apiParam {Object} user New User.
 *
 * @apiSuccess {Object[]} Returns a User object with a new auth token.
 */
publicApi.post('/login', UserHandler.auth)

/**
 * @api {get} /articles Get articles
 * @apiName getArticles
 * @apiGroup Articles
 *
 *
 * @apiSuccess {Object[]} Returns an array of articles.
 */

publicApi.get('/articles', ArticleHandler.getAll)

/**
 * @api {get} /articles/:id Get article
 * @apiName getArticle
 * @apiGroup Articles
 *
 *
 * @apiSuccess {Object} Returns an article.
 */

publicApi.get('/articles/:id', ArticleHandler.get)

/**
 * @api {post} /articles/:id/comments Post comment
 * @apiName postComment
 * @apiGroup Articles
 *
 *
 * @apiSuccess {Object} Returns a Success message.
 */

publicApi.post('/articles/:id/comments', ArticleHandler.addComment)

/**
 * @api {delete} /articles/:id/comments Delete comment
 * @apiName deleteComment
 * @apiGroup Articles
 *
 *
 * @apiSuccess {Object} Returns a Success message.
 */

publicApi.delete('/articles/:id/comments/:commentId', ArticleHandler.deleteComment)

// ---- Private Routes ----------------------------------

/**
 * @api {get} /api/user/:email Request a User
 * @apiName GetUserAuthed
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 *
 * @apiSuccess {Object[]} Returns a User object.
 */

protectedApi.get('/users/:email', UserHandler.get)

/**
 * @api {put} /api/users/:email Update a User
 * @apiName updateUser
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 *
 * @apiSuccess {Object[]} Returns a User object.
 */
protectedApi.put('/users/:email', auth, UserHandler.update)

/**
 * @api {delete} /api/users/:email Delete a User
 * @apiName deleteUser
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 *
 * @apiSuccess {String} Returns a success message.
 */
protectedApi.delete('/users/:email', auth, UserHandler.delete)

/**
 * @api {post} /users/:email/articles Adds a new article
 * @apiName addArticle
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {Object} article User created article.
 * @apiSuccess {String} Returns a success message.
 */
protectedApi.post('/users/:email/articles', auth, UserHandler.addArticle)

/**
 * @api {put} /users/:email/articles/:id Updates an article
 * @apiName updateArticle
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {Object} article User updated article.
 * @apiSuccess {String} Returns a success message.
 */
protectedApi.put('/users/:email/articles/:id', auth, UserHandler.updateArticle)

/**
 * @api {delete} /users/:email/articles/:id Deletes an article
 * @apiName deleteArticle
 * @apiGroup User
 *
 * @apiParam {String} email Users unique email.
 * @apiParam {Object} article User deleted article.
 * @apiSuccess {String} Returns a success message.
 */
protectedApi.delete('/users/:email/articles/:id', auth, UserHandler.deleteArticle)

module.exports = {
  protectedApi: protectedApi,
  publicApi: publicApi
}

// Only let users update their own account
function auth(req, res, next) {
  if (req.userCheck !== req.params.email) {
    return res.status(403).json({
      success: false,
      message: 'Not in my house!'
    })
  }
  return next()
}
