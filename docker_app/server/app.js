const express = require('express')
const cors = require('cors')
const middleware = require('./utils/middleware')
const db_conn = require('./utils/dbConnection')
const app = express()

const { connectDB } = db_conn
connectDB();

const testRouter = require('./controllers/test')

app.use(express.json())
app.use(cors())
app.use(middleware.requestLogger)

app.use('/api/test', testRouter)

app.use(middleware.unknownEndpoint)

module.exports = app