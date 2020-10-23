const request = require('supertest');
const app = require('../index');

describe('GET /', () => {
	it('Successfully queries the index route', async () => {
		const response = await request(app)
			.get('/')

		expect(response.statusCode).toBe(200);
	});
});

