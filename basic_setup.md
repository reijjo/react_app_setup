# PROJECTS ROOT FOLDER

## Files

# FRONTEND
* in the projects root folder:
	npx create-react-app client
	cd client

* make necessery folders and files
cd src
mkdir components services

* remove extra stuff
rm App.css App.test.js logo.svg reportWebVitals.js setupTests.js

## Packages
npm install
* axios
* react-router-dom

## Files

### App.js
```js
const App = () => {
	return (
		<div>
			HELLO
		</div>
	)

}
export default App;
```

### index.js
```js
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
    <App />
);
```



# BACKEND
* in the projects root folder:
mkdir server
cd server
npm init -y

* make necessery folders and files
mkdir controllers utils
touch app.js index.js .env .gitignore

## Packages
npm install
* express
* cors
* dotenv

npm install --save-dev
* nodemon

## Files

### .env
PORT=3001

### package.json
* add these lines
```json
  "scripts": {
    // ..,
		"start": "node index.js",
		"dev": "nodemon index.js"
  },
```

### index.js
```js
const app = require('./app')
const config = ('./utils/config')

app.listen(config.PORT, () => {
	console.log(`Server on port ${config.PORT}`)
})
```

### app.js
```js
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
```

### utils/config.js
```js
require('dotenv').config()

let PORT = process.env.PORT

module.exports = {
	PORT
}
```

### utils/middleware.js
```js
const requestLogger = (req, res, next) => {
	console.log('Method:', req.method)
	console.log('Path: ', req.path)
	console.log('Body: ', req.body)
	console.log('---')
	next()
}

const unknownEndpoint = (req, res) => {
	res.status(404).send({ error: 'unknown endpoint'})
}

module.exports = {
	requestLogger, unknownEndpoint
}
```

### controllers/test.js
<!-- for testing the backend -->
```js
const testRouter = require('express').Router()
testRouter.get('/', (req, res) => {
	res.send('HELLO FROM THE BACKEND!?!?')
})

module.exports = testRouter
```

# How to run:
## Frontend folder:
* npm start
* try that it works:
http://localhost:3000

## Backend folder:
* npm run start
or
* npm run dev
* try that it works:
http://localhost:3001/api/test