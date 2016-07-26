const test = require('tape')
const request = require('supertest')
const mongoose = require('mongoose')

const User = require('./users/userModel')
const Article = require('./articles/articleModel')
const app = require('../main')

test('Clean', require('./test_helper'))

let token;

test('Add a user', t => {
  request(app)
    .post('/signup')
    .field('name', 'Rick Sanchez')
    .field('email', 'plumbus@interplanet.com')
    .field('password', 'plumbusamongus')
    .expect(200)
    .end(async (err) => {
      const count = await User.count().exec()
      const user = await User.findOne({
        email: 'plumbus@interplanet.com'
      }).exec()
      t.ifError(err);
      t.same(count, 1, 'should only be one Rick in here');
      t.same(user.email, 'plumbus@interplanet.com');
      t.end();
    })
})
test('failing to login a user with the wrong email credentials', t => {
  request(app)
    .post('/login')
    .send({
      email: 'derpus@interplanet.com',
      password: 'plumbusamongus'
    })
    .expect(200)
    .end(async (err, res) => {
      t.ifError(err);
      t.end();
    })
})

test('log a user in', t => {
  request(app)
    .post('/login')
    .send({
      email: 'plumbus@interplanet.com',
      password: 'plumbusamongus'
    })
    .expect(200)
    .end(async (err, res) => {
      t.ifError(err);
      t.same(res.body.user.name, 'Rick Sanchez', 'should only be one Rick in here');
      t.same(res.body.user.email, 'plumbus@interplanet.com', 'Should be the Rickest email!');
      t.end();
    })
})

test('Update a user', t => {
  request(app)
    .put('/api/users/plumbus@interplanet.com')
    .send({
      name: 'Tiny Rick'
    })
    .expect(200)
    .end(async (err, res) => {
      t.ifError(err)
      t.same(res.body.user.name, 'Tiny Rick', 'should only be one Tiny Rick in here');
      t.end()
    })
})
