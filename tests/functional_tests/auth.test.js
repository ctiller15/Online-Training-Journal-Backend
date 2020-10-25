const request = require('supertest');
const app = require('../../index');
const db = require('../../src/models')

let token;

let tempdb = db;

beforeEach( async () => {
	await tempdb.sequelize.sync({ force: true })
});

describe('POST /signup', () => {
	it('should create a new user when registered.', async () => {
		const email = 'testsexample@example.com'

		const response = await request(app)
			.post('/signup')
			.send({
				email: 'testsexample@example.com',
				password: 'password'
			})

		expect(response.statusCode).toBe(200);

		const createdUser = await db.models.User.findOne(
			{
				where: { email: email }
			}
		);

		expect(createdUser).not.toBeNull()
	});

	it('does not allow users with the same email to be created', async () => {
		throw new Error('finish the test!');
	});
});

afterEach( async () => {
	await tempdb.sequelize.close()
});
