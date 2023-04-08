const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')
const app = express()

const testRouter = require('./controllers/test')

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)

app.use('/api/test', testRouter)

app.use(middleware.unknownEndpoint)

module.exports = app