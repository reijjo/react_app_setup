const config = require('./config')
const { Pool } = require('pg')

const pool = new Pool({
	user: config.PGUSER,
	host: config.PGHOST,
	database: config.PGDATABASE,
	password: config.PGPASSWORD,
	port: config.PGPORT
})

const connectDB = () => {
	pool.connect((err, client, release) => {
		if (err) {
			console.log('Error acquiring client', err.stack)
			console.log('Retrying in 5 seconds...')
			setTimeout(connectDB, 5000)
		}
		else {
			console.log(`Connected to database ${config.PGDATABASE}`)
		}
	})
}

module.exports = {
	pool, connectDB
}