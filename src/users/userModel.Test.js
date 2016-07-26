const chai = require('chai')
const should = chai.should()
const expect = chai.expect
const mongoose = require('mongoose')

// Using local instance of mongo for testing
// Make sure you have 'mongod' running
// See here for instructions:
// https://docs.mongodb.com/manual/administration/install-community/
// Using homebrew is the easiest way to get it running locally

mongoose.connect('mongodb://localhost/blogged_test');

const User = require('./userModel')
// Basic User Model Tests
describe('User', () => {
  before((done) => {
    User.remove({}, (err) => {
      if (err) {
        done(err)
      }
      done()
    })
  })
  it('should be able to save a user', (done) => {
    let user = new User({
      name: 'Rick Sanchez',
      email: 'plumbus@interplanet.com',
      password: 'plumbusamongus'
    })
    user.save((err) => {
      if (err) {
        return done(err)
      }
      expect(err).to.equal(null)
      done()
    })
  })
  it('should be able to find a user by email', (done) => {
    User.findOne({
      email: 'plumbus@interplanet.com'
    }, (err, user) => {
      if (err) {
        return done(err)
      }
      expect(user).to.be.an('object')
      expect(user).to.have.property('email')
      expect(user).to.have.property('name')
      expect(user).to.have.property('password')
      //should be hashed so this should not be equal with out using compare function
      expect(user.password).to.not.equal('plumbusamongus')
      user.checkPassword('plumbusamongus', (err, isMatch) => {
        if (err) {
          return done(err)
        }
        expect(isMatch).to.equal(true)
        return done()
      })
    })
  })
})
