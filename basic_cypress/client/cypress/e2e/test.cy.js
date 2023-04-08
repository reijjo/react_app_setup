/* eslint-disable no-undef */

describe('Simple Test ', function() {
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
})