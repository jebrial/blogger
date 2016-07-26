'use strict'
const User = require('./userModel')
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
  get: (req, res) => {
    if (!req.params.email) {
      return res.json({
        success: false,
        message: 'email not provided',
        user: null
      })
    }
    User.findOne({
      email: email
    }, (err, user) => {
      if (err) {
        return res.json({
          success: false,
          err: err,
          user: null
        })
      }
      //do not return the password
      user.password = null

      res.json({
        success: true,
        user: user
      })
    })
  },

  // Update a user
  update: (req, res) => {
    if (!req.params.email) {
      return res.json({
        success: false,
        message: 'email not provided',
        user: null
      })
    }
    User.findOne({
      email: email
    }, (err, user) => {
      if (err) {
        return res.json({
          success: false,
          err: err,
          user: null
        })
      }
      if (req.body.email) {
        user.email = req.body.email
      }
      if (req.body.password) {
        user.password = req.body.password
      }
      if (req.body.name) {
        user.name = req.body.name
      }
      user.save((err, user) => {
        //do not return the password
        user.password = null
        res.json({
          success: true,
          user: user
        })
      })
    })
  },

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
  addArticle: (req, res) => {

  },

  // Update a user's article
  updateArticle: (req, res) => {

  },

  // Delete a user's article
  deleteArticle: (req, res) => {

  }
}

module.exports = userHandler
