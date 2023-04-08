const testRouter = require('express').Router()
testRouter.get('/', (req, res) => {
	res.send('HELLO FROM THE BACKEND!?!?')
})

module.exports = testRouter