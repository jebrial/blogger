'use strict'
const app 			= require('express')()
const bodyParser 	= require('body-parser')
const logger 		= require('morgan')
const mongoose		= require('mongoose')
const helmet 		= require('helmet')
const config 		= require('./config')

mongoose.connect(config.mongoDBURL, (err) => {
	if (err) {
		throw err
	}
	console.log('MongoDB connection successful.')
})

app.set('port', config.port || 3001)
app.set('secret', config.tokenSecret)
app.use(logger('dev'))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Ok lets do this!
app.use(helmet())

const serverListener = app.listen(app.get('port'), () => {
	console.log("app listening on:", serverListener.address().port)
})
