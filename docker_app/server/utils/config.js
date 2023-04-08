require('dotenv').config()

let PORT = process.env.PORT
let PGUSER = process.env.PGUSER
let PGHOST = process.env.PGHOST
let PGDATABASE = process.env.PGDATABASE
let PGPASSWORD = process.env.PGPASSWORD
let PGPORT = process.env.PGPORT

module.exports = {
	PORT, PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT
}