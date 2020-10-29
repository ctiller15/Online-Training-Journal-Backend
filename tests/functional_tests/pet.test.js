const request = require('supertest')
const app = require('../../index')
const db = require('../../src/models')
const { createUserToken } = require('../helpers/authHelpers')

let tempdb = db

beforeAll( async () => {
	await tempdb.sequelize.sync({ force: true, logging: false });
});

describe('/user/profile/pets', () => {
	it('does not allow an unauthorized user to see a single pet.', async () => {
		const pets = ['Stanley', 'Alana'];

		const petIds = [];

		const tokenCookie = await createUserToken();

		for(let pet of pets){
			const result = await request(app)
				.post('/user/profile/pets/new')
				.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
				.send({
					name: pet
				})

			petIds.push(result.body.id);
		}

		const response = await request(app)
			.get(`/user/profile/pets/${petIds[0]}`)

		expect(response.statusCode).toBe(401);
	});

	it('allows an authorized user to see a single pet.', async () => {
		const pets = ['Stanley', 'Alana'];

		const petIds = [];

		const tokenCookie = await createUserToken();

		for(let pet of pets){
			const result = await request(app)
				.post('/user/profile/pets/new')
				.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
				.send({
					name: pet
				})

			petIds.push(result.body.id);
		}

		const response = await request(app)
			.get(`/user/profile/pets/${petIds[0]}`)
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		expect(response.statusCode).toBe(200);
		expect(response.body.name).toBe(pets[0]);
	});

	it('does not allow an unauthorized user to see their pets', async () => {
		const pets = ['Stanley', 'Alana'];

		const tokenCookie = await createUserToken();

		for(let pet of pets){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
				.send({
					name: pet
				})
		}

		const response = await request(app)
			.get('/user/profile/pets')

		expect(response.statusCode).toBe(401);
	});

	it('allows an authorized user to see their pets', async () => {
		const pets = ['Stanley', 'Alana'];

		const tokenCookie = await createUserToken();

		for(let pet of pets){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
				.send({
					name: pet
				})
		}

		const response = await request(app)
			.get('/user/profile/pets')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(2);
		for(let i = 0; i < pets.length; i++){
			expect(response.body[i].name).toBe(pets[i]);
		}
	});

	it('ensures two different users only see their pets.', async () => {
		const petSet1 = ['Stanley', 'Alana']
		const petSet2 = ['Ziggy', 'Mo']

		const tokenCookie = await createUserToken();
		const secondUserTokenCookie = await createUserToken();

		for(let pet of petSet1){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
				.send({
					name: pet
				})
		}

		for(let pet of petSet2){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Cookie', [`jwt=${secondUserTokenCookie['jwt']}`])
				.send({
					name: pet
				})
		}

		const response = await request(app)
			.get('/user/profile/pets')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		const secondResponse = await request(app)
			.get('/user/profile/pets')
			.set('Cookie', [`jwt=${secondUserTokenCookie['jwt']}`])


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

		const tokenCookie = await createUserToken();

		const response = await request(app)
			.post('/user/profile/pets/new')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
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

	it('does not allow an unauthorized user to edit a pet', async () => {
		const tokenCookie = await createUserToken();

		const createdPet = await request(app)
			.post('/user/profile/pets/new')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
			.send({
				name: 'Stanley'
			})
		
		const id = createdPet.body.id;

		await request(app)
			.put(`/user/profile/pets/${id}`)
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
			.send({
				name: 'Alana'
			})

		const response = await request(app)
			.get(`/user/profile/pets/${id}`)

		expect(response.statusCode).toBe(401);
	});

	it('allows an authorized user to edit a pet', async () => {
		const tokenCookie = await createUserToken();

		const createdPet = await request(app)
			.post('/user/profile/pets/new')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
			.send({
				name: 'Stanley'
			})
		
		const id = createdPet.body.id;

		await request(app)
			.put(`/user/profile/pets/${id}`)
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
			.send({
				name: 'Alana'
			})

		const response = await request(app)
			.get(`/user/profile/pets/${id}`)
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		expect(response.statusCode).toBe(200);
		expect(response.body.id).toBe(id);
		expect(response.body.name).toBe('Alana');
	});

	it('does not allow an unauthorized user to remove a pet', async () => {
		const tokenCookie = await createUserToken();

		const createdPet = await request(app)
			.post('/user/profile/pets/new')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
			.send({
				name: 'Stanley'
			})
		
		const id = createdPet.body.id;

		await request(app)
			.delete(`/user/profile/pets/${id}`)
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		const response = await request(app)
			.get(`/user/profile/pets/${id}`)

		expect(response.statusCode).toBe(401);
	});

	it('allows an authorized user to remove a pet', async () => {
		const tokenCookie = await createUserToken();

		const createdPet = await request(app)
			.post('/user/profile/pets/new')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
			.send({
				name: 'Stanley'
			})
		
		const id = createdPet.body.id;

		await request(app)
			.delete(`/user/profile/pets/${id}`)
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		const response = await request(app)
			.get(`/user/profile/pets/${id}`)
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		expect(response.statusCode).toBe(200);
		expect(Object.keys(response.body)).toHaveLength(0);
	});

	it('logs out a user by expiring their cookie', async () => {
		const tokenCookie = await createUserToken();

		const pets = ['Stanley', 'Alana', 'Hulk'];

		for(let pet of pets){
			await request(app)
				.post('/user/profile/pets/new')
				.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
				.send({
					name: pet
				})
		}

		const response = await request(app)
			.get('/user/profile/pets')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])

		expect(response.statusCode).toBe(200);
		expect(response.body).toHaveLength(pets.length);
		for(let i = 0; i < pets.length; i++){
			expect(response.body[i].name).toBe(pets[i]);
		}

		const logout = await request(app)
			.post('/logout')
			.set('Cookie', [`jwt=${tokenCookie['jwt']}`])
			.send({})

		expect(logout.statusCode).toBe(200);
	})

	it('does not allow an unauthenticated user to log out', async () => {
		const response = await request(app)
			.post('/logout')
			.send({})

		expect(response.statusCode).toBe(401);
	})
})

afterAll( async () => {
	await tempdb.sequelize.close()
});
