'use strict'
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const salt_factor = 10

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    index: {
      unique: true
    }
  },
  password: {
    type: String,
    required: true
  }
}, {
  timestamps: {}
})

// Presave function for users - hashes the password
UserSchema.pre('save', function(next) {
  let user = this
  if (!user.isModified('password')) {
    return next
  }

  bcrypt.genSalt(salt_factor, (err, salt) => {
    if (err) {
      return next(err)
    }
    bcrypt.hash(user.password, salt, (err, hash) => {
      if (err) {
        return next(err)
      }
      user.password = hash
      next()
    })
  })
})

// Check password function for user verification
UserSchema.methods.checkPassword = function(pw) {
  return new Promise((resolve, reject) => {
    bcrypt.compare(pw, this.password, (err, isMatch) => {
      if (err) {
        return reject(err)
      }
      resolve(isMatch)
    })
  })
}


module.exports = mongoose.model('User', UserSchema)
