# Cypress for End to End testing
* add this stuff to basic_app

## FRONTEND
npm install --save-dev cypress

### package.json
```json
{
// ...
  "scripts": {
// ..
    "cypress:open": "cypress open",
    "test:e2e": "cypress run"
  },
// ...
}
```

## BACKEND

# How to:
## Frontend
* npm run cypress:open
* new window pops upp and choose E2E Testing => Continue => Choose your browser => Create new spec => cypress/e2e/test_app.cy.js => Close the test 'Great! The spec was successfully added'
* Use VS Code for testing
### cypress/e2e/test.cy.js
```js
describe('Simple Test '), function() {
	it('front page can be opened', function() {
		cy.visit('http://localhost:3000')
		cy.contains('HELLO')
	})

		it('backend works?', function() {
		cy.request('GET', 'http://localhost:3001/api/test')
		.then((response) => {
			expect(response.status).to.eq(200)
			expect(response.body).to.eq('HELLO FROM THE BACKEND!?!?')
		})
	})
}
```

* run the test by clicking the test name in cypress client window (one of those windows what just popped up)

# How to use:
* Keep tests running on the background => 'npm run cypress:open' on the frontend folder and click the test name on the cypress client window
* OR 'npm run test:e2e' to run all the tests at once without having to have Cypress running on the background all the time

## Works also in app running with Docker