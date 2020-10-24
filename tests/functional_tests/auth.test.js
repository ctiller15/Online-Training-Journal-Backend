const request = require('supertest');
const app = require('../../index');

let token;

beforeEach(() => {
	// Create mock database.
});

describe('POST /register', () => {
	it('should create a new user when registered.', () => {
		return request(app)
			.post('/register')
			.then((response) => {
				expect(response.statusCode).toBe(200)
			});

		throw new Error('finish the test!');
	});
});
