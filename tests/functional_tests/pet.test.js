const request = require('supertest')
const app = require('../../index')
const db = require('../../src/models')

let tempdb = db
let transaction
let token

const payload = {
	email: 'pettestexample@example.com',
	password: 'pettestpassword'
}

beforeAll( async () => {
	await tempdb.sequelize.sync({ force: true })
});

beforeEach( async () => {
	transaction = await tempdb.sequelize.transaction();

	await request(app)
		.post('/signup')
		.send(payload)

	const loginResponse = await request(app)
		.post('/login')
		.send(payload)

	token = loginResponse.body.token
});

describe('GET /user/profile/pets', () => {
	it('allows an authorized user to create a pet.', async () => {
		const response = await request(app)
			.post('/user/pets/new')
			.set('Authorization', `bearer ${token}`)
			.send({
				name: 'Stanley'
			})

		expect(response.statusCode).toBe(200);
		throw new Error('Finish the test!');
	})
})

afterEach( async () => {
	await transaction.rollback();
});

afterAll( async () => {
	await tempdb.sequelize.close()
});
