const chai = require('chai')
const should = chai.should()
const expect = chai.expect


// Using local instance of mongo for testing
// Make sure you have 'mongod' running
// See here for instructions:
// https://docs.mongodb.com/manual/administration/install-community/
// Using homebrew is the easiest way to get it running locally


const Article = require('./articleModel')
const User = require('../users/userModel')

describe('Article', () => {

  before((done) => {
    User.remove({}, (err) => {
      if (err) {
        done(err)
      }
      let user = new User({
        name: 'Rick Sanchez',
        email: 'plumbus@interplanet.com',
        password: 'plumbusamongus'
      })
      user.save((err) => {
        if (err) {
          return done(err)
        }
        done()
      })
    })
  })

  after((done) => {
    User.remove({}, (err) => {
      if (err) {
        return done(err)
      }
      Article.remove({}, (err) => {
        if (err) {
          return done(err)
        }
        done()
      })
    })
  })
  it('should create a new article', (done) => {
    let article = new Article({
      title: 'The Plumbus amongus',
      body: 'This is a discussion about the daily use of plumbusus',
      authorName: 'Rick Sanchez',
      authorEmail: 'plumbus@interplanet.com'
    })
    article.save((err, result) => {
      if (err) {
        return done(err)
      }
      expect(result).to.have.property('title')
      expect(result).to.have.property('body')
      expect(result).to.have.property('authorName')
      expect(result).to.have.property('authorEmail')
      done()
    })

  })
})
