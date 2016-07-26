'use strict'
const jwt = require('jsonwebtoken')
const User = require('./users/userModel')

//Authorization check - middleware for protected routes
const authorize = (config) => (req, res, next) => {
  //Skip auth during tests
  if (process.env.NODE_ENV === 'test') {
    req.userCheck = 'plumbus@interplanet.com'
    return next()
  }

  const token = req.body.token || req.query.token || req.headers['x-access-token']
  jwt.verify(token, config.secret, (err, result) => {
    if (err) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized'
      })
    }

    // IMPORTANT
    // set check so when we hit routes users can't mess with other users!
    req.userCheck = result.email
    next()
  })
}

module.exports = authorize
