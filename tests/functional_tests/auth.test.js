const request = require('supertest');
const app = require('../../index');
const db = require('../../src/models')

let token;

let tempdb = db;
let transaction = "test";

beforeAll( async () => {
	await tempdb.sequelize.sync({ force: true })
});

beforeEach( async () => {
	transaction = await tempdb.sequelize.transaction();
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
		const email = 'testsexample@example.com'

		const response = await request(app)
			.post('/signup')
			.send({
				email: email,
				password: 'password'
			})

		const secondResponse = await request(app)
			.post('/signup')
			.send({
				email: email,
				password: 'password'
			})

		expect(secondResponse.statusCode).toBe(500);
	});
});

describe('POST /signin', () => {
	it('signs in an existing user.', async () => {
		const email = 'testsexample@example.com'
		const password = 'password'

		await request(app)
			.post('/signup')
			.send({
				email: email,
				password: password
			})

		const signinResponse = await request(app)
			.post('/login')
			.send({
				email: email,
				password: password
			})

		expect(signinResponse.statusCode).toBe(200);
		expect(signinResponse.body.token.length).not.toEqual(0);
	});

	it('throws an error if the email does not exist.', async () => {
		const email = 'testsexample@example.com'
		const incorrectEmail = 'testsexamplefake@example.com'
		const password = 'password'

		await request(app)
			.post('/signup')
			.send({
				email: email,
				password: password
			})

		const signinResponse = await request(app)
			.post('/login')
			.send({
				email: incorrectEmail,
				password: password
			})

		expect(signinResponse.statusCode).toBe(404);
		expect(signinResponse.body.token).toBeFalsy();
		expect(signinResponse.body.error).toBe('User not found');
	});

	it('throws an error if the password is incorrect.', async () => {
		const email = 'testsexample@example.com'
		const password = 'password'
		const incorrectpassword = 'badpassword'

		await request(app)
			.post('/signup')
			.send({
				email: email,
				password: password
			})

		const signinResponse = await request(app)
			.post('/login')
			.send({
				email: email,
				password: incorrectpassword
			})

		expect(signinResponse.statusCode).toBe(401);
		expect(signinResponse.body.token).toBeFalsy();
		expect(signinResponse.body.error).toBe('Incorrect Password');
	});
});

afterEach( async () => {
	await transaction.rollback();
});

afterAll( async () => {
	await tempdb.sequelize.close()
});

