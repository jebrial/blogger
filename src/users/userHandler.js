'use strict'
const User = require('./userModel')
const Article = require('../articles/articleModel')
const authconfig = require('../../config')[process.env.NODE_ENV || 'dev'].jwt
const jwt = require('jsonwebtoken')
const co = require('co-express')
const userHandler = {

  // auth user
  auth: co(function*(req, res) {

    const email = req.body.email
    const password = req.body.password

    if (!email || !password) {
      return res.json({
        success: false,
        err: 'Missing email or password',
        data: []
      })
    }

    let user = yield User.findOne({
      email: email
    }).exec()
    if (user) {
      const isMatch = yield user.checkPassword(password)
      if (isMatch) {

        //do not return the password
        user.password = null
        //Creat token
        const token = jwt.sign({
          email: user.email
        }, authconfig.secret, {
          expiresIn: 60 * 60 * 24 * 7 //Expires in one week
        })

        return res.json({
          success: true,
          err: null,
          token: token,
          user: user
        })
      }
    }
    res.json({
      success: false,
      err: 'Error logging in',
      user: null
    })

  }),



  // Add new user
  add: co(function*(req, res) {

    let user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })

    try {

      const result = yield user.save()

    } catch (err) {

      return res.json({
        success: false,
        err: 'err',
        data: null
      })
    }

    return userHandler.auth(req, res)
  }),



  // Get one user by email
  get: co(function*(req, res) {
    if (!req.params.email) {
      return res.json({
        success: false,
        message: 'email not provided',
        user: null
      })
    }

    const user = yield User.findOne({
      email: req.params.email
    }).exec()

    if (user) {
      //do not return the password
      user.password = null
      return res.json({
        success: true,
        user: user
      })
    }

    return res.json({
      success: false,
      err: 'Error',
      user: null
    })
  }),



  // Update a user
  update: co(function*(req, res) {
    const email = req.params.email
    if (!email) {
      return res.json({
        success: false,
        message: 'email not provided',
        user: null
      })
    }

    const user = yield User.findOne({
      email: email
    }).exec()

    if (user) {
      const insert = {}
      if (req.body.email) {
        insert.email = req.body.email
      }
      if (req.body.password) {
        insert.password = req.body.password
      }
      if (req.body.name) {
        insert.name = req.body.name
      }
      try {
        const result = yield user.update(insert)
      } catch (err) {
        return res.json({
          success: false,
          error: 'Unable to update user'
        })
      }
      //result.password = null
      return res.json({
        success: true,
        message: 'User updated'
      })
    }
    return res.json({
      success: false,
      err: 'Unable to get user',
      user: null
    })
  }),

  // Delete a user
  delete: (req, res) => {
    if (!req.params.email) {
      return res.json({
        success: false,
        message: 'email not provided',
        user: null
      })
    }
    User.delete({
      email: email
    }, (err) => {
      if (err) {
        return res.json({
          success: false,
          err: err
        })
      }

      res.json({
        success: true,
        message: 'Success'
      })
    })
  },

  // Add new article
  addArticle: co(function*(req, res) {
    const user = yield User.findOne({
      email: req.params.email
    }).exec()
    if (user) {
      let article = new Article({
        title: req.body.title,
        text: req.body.text,
        authorName: user.name,
        authorEmail: user.email
      })
      try {
        yield article.save()
      } catch (err) {
        return res.json({
          success: false,
          err: 'Could not save article'
        })
      }
      return res.json({
        success: true,
        message: "New Article added"
      })
    }
    return res.json({
      success: false,
      article: null
    })
  }),

  // Update a user's article
  updateArticle: co(function*(req, res) {
    let result;
    try {
      result = yield Article.findOne({
        _id: req.params.id
      }).exec()
    } catch (err) {
      return res.json({
        success: false
      })
    }
    const insert = {}
    if (req.body.text) {
      insert.text = req.body.text
    }
    try {
      yield result.update(insert)
    } catch (err) {
      return res.json({
        success: false
      })
    }
    return res.json({
      success: true
    })

  }),

  // Delete a user's article
  deleteArticle: co(function*(req, res) {
    try {
      yield Article.remove({
        _id: req.params.id
      })
    } catch (err) {
      return res.json({
        success: false
      })
    }
    return res.json({
      success: true
    })
  })
}

module.exports = userHandler
