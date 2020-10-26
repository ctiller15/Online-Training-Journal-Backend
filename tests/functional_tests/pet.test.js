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

describe('/user/profile/pets', () => {
	it('allows an authorized user to create a pet.', async () => {
		const response = await request(app)
			.post('/user/profile/pets/new')
			.set('Authorization', `bearer ${token}`)
			.send({
				name: 'Stanley'
			})

		expect(response.statusCode).toBe(200);
		expect(await tempdb.models.Pet.findAll()).toHaveLength(1);
	})

	it('does not allow an unauthorized user to create a pet.', async () => {
		const response = await request(app)
			.post('/user/profile/pets/new')
			.send({
				name: 'Stanley'
			})

		expect(response.statusCode).toBe(401);
	});
})

afterEach( async () => {
	await transaction.rollback();
});

afterAll( async () => {
	await tempdb.sequelize.close()
});
