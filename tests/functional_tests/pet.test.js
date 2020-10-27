const request = require('supertest')
const app = require('../../index')
const db = require('../../src/models')

let tempdb = db
let transaction
let token
let secondUserToken

const payload = {
	email: 'pettestexample@example.com',
	password: 'pettestpassword'
}

const secondUserPayload = {
	email: 'secondpettestexample@example.com',
	password: 'secondpettestpassword'
}

beforeEach( async () => {
	await tempdb.sequelize.sync({ force: true, logging: false });

	await request(app)
		.post('/signup')
		.send(payload)

	await request(app)
		.post('/signup')
		.send(secondUserPayload)

	const loginResponse = await request(app)
		.post('/login')
		.send(payload)

	const secondLoginResponse = await request(app)
		.post('/login')
		.send(secondUserPayload)

	token = loginResponse.body.token
	secondUserToken = secondLoginResponse.body.token
});

describe('/user/profile/pets', () => {
	it('allows an authorized user to see their pets', async () => {
		const pets = ['Stanley', 'Alana'];

		for(let pet of pets){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Authorization', `bearer ${token}`)
				.send({
					name: pet
				})
		}

		const response = await request(app)
			.get('/user/profile/pets')
			.set('Authorization', `bearer ${token}`)

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(2);
		for(let i = 0; i < pets.length; i++){
			expect(response.body[i].name).toBe(pets[i]);
		}
	});

	it('ensures two different users only see their pets.', async () => {
		const petSet1 = ['Stanley', 'Alana']
		const petSet2 = ['Ziggy', 'Mo']

		for(let pet of petSet1){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Authorization', `bearer ${token}`)
				.send({
					name: pet
				})
		}

		for(let pet of petSet2){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Authorization', `bearer ${secondUserToken}`)
				.send({
					name: pet
				})
		}

		const response = await request(app)
			.get('/user/profile/pets')
			.set('Authorization', `bearer ${token}`)

		const secondResponse = await request(app)
			.get('/user/profile/pets')
			.set('Authorization', `bearer ${secondUserToken}`)


		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(petSet1.length);
		expect(secondResponse.statusCode).toBe(200);
		expect(secondResponse.body).toHaveLength(petSet2.length);

		for(let i = 0; i < petSet2.length; i++){
			expect(response.body[i].name).toBe(petSet1[i]);
		}

		for(let i = 0; i < petSet2.length; i++){
			expect(secondResponse.body[i].name).toBe(petSet2[i]);
		}
	});

	it('allows an authorized user to create a pet.', async () => {
		const startLength = await tempdb.models.Pet.count();

		const response = await request(app)
			.post('/user/profile/pets/new')
			.set('Authorization', `bearer ${token}`)
			.send({
				name: 'Stanley'
			})

		expect(response.statusCode).toBe(200);
		expect(await tempdb.models.Pet.count()).toBe(startLength + 1);
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

afterAll( async () => {
	await tempdb.sequelize.close()
});
