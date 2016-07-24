'use strict'
/*
Please create a NodeJS project for a Blog API.
It should support authenticated endpoints for authors to create posts,
allow public commenting and public viewing of posts / comments.
No visual UI is required.
Choose whatever database / storage repository you prefer.
The project should include simple setup instructions and example curl requests or
other form of API documentation so as to allow a developer to quickly start calling your APIs.
We are looking for a functioning API along with high quality code, basic docs, use of best practices, and tests.
Please place it up on github once you've completed it.
*/
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
