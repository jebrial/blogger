// Main entry point to start app
'use strict'
const app = require('express')()
const bodyParser = require('body-parser')
const logger = require('morgan')
const mongoose = require('mongoose')
const helmet = require('helmet')
const authorize = require('./src/authorize')

// -- IMPORTANT -- Only loading config for env
const config = require('./config')[process.env.NODE_ENV || 'dev']
const routes = require('./src/routes')

// Set up express
app.set('port', config.port || 3001)
app.use(logger('dev'))
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())

// Security!
app.use(helmet())


// Public routes
app.use('/', routes.publicApi)

// Private routes
app.use('/api', authorize(config.jwt), routes.protectedApi)

// Connect to MONGODB
mongoose.Promise = global.Promise
mongoose.connect(config.mongoDBURL, (err) => {
  if (err) {
    throw err
  }
  console.log('MongoDB connection successful.')
  const server = app.listen(app.get('port'), () => {
    console.log("app listening on:", server.address().port)
  })
})

// Export App
module.exports = app
