# Docker

## PROJECTS ROOT FOLDER

### Make docker-compose file
* touch docker-compose.yml
```yml
version: '3.8'

services:
	server:
		build: ./server
		container_name: MY_BACKEND
		depends_on:
			- db
		env_file:
			- .env
		environment:
			WAIT_HOSTS: db:5432
		ports:
			- 3001:3001
		volumes:
			- /app/node_modules
			- ./server:/app
		command: npm run dev
		restart: on-failure

	client:
		build: ./client
		container_name: MY_FRONTEND
		environment:
			- NODE_PATH=src
			- CHOKIDAR_USEPOLLING=true
		ports:
			- 3000:3000
		volumes:
			- ./client/src:/app/src
		links:
			- server
		extra_hosts:
			- "host.docker.internal:host-gateway"
		command: npm start



```


### Make dockerCleaner script
* touch dClean.sh
```sh
docker-compose down &&
docker rmi -f $(docker images -a -q) &&
docker volume prune -f
```
It's good to run the script 'sh dClean.sh' before docker-compose up if you made some bigger changes to the project

### Set database up
* mkdir db

#### In the db folder
* touch servers.json
```json
{
		"Servers": {
			"1": {
				"Name": "myProject",
				"Group": "Server Group 1",
				"Port": 5432,
				"Username": "username",
				"Host": "db",
				"SSLMode": "prefer",
				"MaintenanceDB": "myProject"
			}
		}
}
```
#### Create database tables
* touch init.sql
```sql
SET timezone = 'Europe/Helsinki';

CREATE TABLE IF NOT EXISTS users (
	id SERIAL NOT NULL PRIMARY KEY,
	username VARCHAR(255) NOT NULL
)
```


## FRONTEND
* touch Dockerfile
```Dockerfile
# Description: Dockerfile for the client

# Use the official Node.js alpine image which is a small version of Node.js
FROM node:alpine

# Create a directory for the app in the container
RUN mkdir -p /app

# Set the working directory for the app in the container to /app
WORKDIR /app

# Copy dependencies from package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Copy all files to the current directory in the container
COPY ./ ./

# Install dependencies
RUN npm i

# Command to run the app
CMD ["npm", "run", "start"]
```

## BACKEND
* touch Dockerfile
```Dockerfile
# Description: Dockerfile for the server

# Use the official Node.js alpine image which is a small version of Node.js
FROM node:alpine

# Create a directory for the app in the container
RUN mkdir -p /app

# Set the working directory for the app in the container to /app
WORKDIR /app

# Copy dependencies from package.json and package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Copy all files to the current directory in the container
COPY ./ ./

# Install dependencies
RUN npm i

# Command to run the app
CMD ["npm", "run", "dev"]
```

### Packages
npm install pg

### Files

#### app.js
* add this:
```js
//...
const db_conn = require('./utils/dbConnection)
const { connectDB } = db_conn
connectDB()
//...
```

#### utils/config.js
* add database stuff
```js
//...
let PORT = process.env.PORT
let PGUSER = process.env.PGUSER
let PGHOST = process.env.PGHOST
let PGDATABASE = process.env.PGDATABASE
let PGPASSWORD = process.env.PGPASSWORD
let PGPORT = process.env.PGPORT

module.exports = {
	PORT, PGUSER, PGHOST, PGDATABASE, PGPASSWORD, PGPORT
}
```
#### utils/dbConnection.js
```js
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
```

## Last setup
* Change the projectname/username/password/containernames/networkname for the project
* Make sure that you make the changes to all the files when changing something

### Change projectname:
#### db/servers.json
```js
// ...
"Name": "YOUR_PROJECT_NAME"
// ...
"MaintenanceDB": "YOUR_PROJECT_NAME"
```
#### server/.env
```
PGDATABASE=YOUR_PROJECT_NAME
```
#### docker-compose.yml
```yml
# ...
db:
	environment:
		POSTGRES_DB: YOUR_PROJECT_NAME
# ...
```

### Change username:
#### db/servers.json
```js
// ...
"Username": "YOUR_USERNAME"
// ...
```
#### server/.env
```
PGUSER=YOUR_USERNAME
```
#### docker-compose.yml
```yml
# ...
db:
	environment:
		POSTGRES_USER: YOUR_USERNAME
# ...
```

### Change password:
#### server/.env
```
PGPASSWORD=YOUR_PASSWORD
```
#### docker-compose.yml
```yml
# ...
db:
	environment:
		POSTGRES_PASSWORD: YOUR_PASSWORD
# ...
pgadmin:
	environment:
		PGADMIN_DEFAULT_PASSWORD: YOUR_PASSWORD
```

### Change email/container/networkname:
#### docker-compose.yml
```yml
services:
	server:
		container_name: YOUR_BACKEND_CONTAINER_NAME
# ...
	client:
		container_name: YOUR_FRONTEND_CONTAINER_NAME
# ...
	db:
		container_name: YOUR_DATABASE_CONTAINER_NAME
# ...
	pgadmin:
		container_name: YOUR_PGADMIN_CONTAINER_NAME
		environment:
			PGADMIN_DEFAULT_EMAIL: YOUR@EMAIL.COM
# ...
networks:
	default:
		name: YOUR_NETWORK_NAME
```

# How to run
* Start Docker
* Go to the root folder of your project => docker-compose up

## Frontend: http://localhost:3000
## Backend: http://localhost:3001
## Database: http://localhost:8080
* Login to pgAdmin with your credentials
* Tables are in: Server Group 1 => myProject => Schemas => public => Tables
