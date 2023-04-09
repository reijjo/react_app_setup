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
			- ./server/.env
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

	db:
		container_name: MY_DATABASE
		image: postgres
		restart: always
		env_file:
      - ./server/.env
#   environment:
#     POSTGRES_USER: myUsername
#     POSTGRES_PASSWORD: myPassword
#     POSTGRES_DB: myProject
		volumes:
			- ./db/init.sql:/docker-entrypoint-initdb.d/init.sql
		ports:
			-  5432:5432

	pgadmin:
		container_name: pgAdmin
		image: dpage/pgadmin4
		restart: always
		env_file:
      - ./server/.env
		environment:
#     PGADMIN_DEFAULT_EMAIL: email@email.com
#     PGADMIN_DEFAULT_PASSWORD: myPassword
			GUNICORN_ACCESS_LOGFILE: '/dev/null'
		ports:
			- 8080:80
		volumes:
			- ./db/servers.json:/pgadmin4/servers.json
		logging:
			driver: none

networks:
  default:
    name: my_network

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
				"Username": "myUsername",
				"Host": "db",
				"SSLMode": "prefer",
				"MaintenanceDB": "myProject"
			}
		}
}
```
* Make sure that the "Name" and "MaintenanceDB" are the same than POSTGRES_DB in your server/.env file
* Make sure that "Username" is the same than POSTGRES_USER in your server/.env file

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

### .env
```
# PostgreSQL database credentials
POSTGRES_USER=myUsername
POSTGRES_PASSWORD=myPassword
POSTGRES_DB=myProject
PGADMIN_DEFAULT_EMAIL=your@email.com
PGADMIN_DEFAULT_PASSWORD=myPassword

PGHOST=db
PGPORT=5432

# Port
PORT=3001
```


#### app.js
* add this:
```js
//...
const db_conn = require('./utils/dbConnection')
const { connectDB } = db_conn
connectDB()
//...
```

#### utils/config.js
* add database stuff
```js
require('dotenv').config()

let PORT = process.env.PORT

let POSTGRES_USER = process.env.POSTGRES_USER
let POSTGRES_DB = process.env.POSTGRES_DB
let PGADMIN_DEFAULT_PASSWORD = process.env.PGADMIN_DEFAULT_PASSWORD
let PGHOST = process.env.PGHOST
let PGPORT = process.env.PGPORT

module.exports = {
	PORT, POSTGRES_USER, PGHOST, POSTGRES_DB, PGADMIN_DEFAULT_PASSWORD, PGPORT
}
```
#### utils/dbConnection.js
```js
const config = require('./config')
const { Pool } = require('pg')

const pool = new Pool({
	user: config.POSTGRES_USER,
	host: config.PGHOST,
	database: config.POSTGRES_DB,
	password: config.PGADMIN_DEFAULT_PASSWORD,
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
			console.log(`Connected to database ${config.POSTGRES_DB}`)
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
POSTGRES_DB=YOUR_PROJECT_NAME
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
POSTGRES_USER=YOUR_USERNAME
```


### Change password:
#### server/.env
```
POSTGRES_PASSWORD=YOUR_PASSWORD
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
networks:
	default:
		name: YOUR_NETWORK_NAME
```

#### server/.env
```
PGADMIN_DEFAULT_EMAIL=YOUR@EMAIL.COM
```

# How to run
* Start Docker
* Go to the root folder of your project => docker-compose up

## Frontend: http://localhost:3000
## Backend: http://localhost:3001
## Database: http://localhost:8080
* Login to pgAdmin with your credentials (email and password from your .env file)
* Tables are in: Server Group 1 => myProject => Schemas => public => Tables
