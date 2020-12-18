const { createUserToken } = require('../helpers/authHelpers')
const request = require('supertest')
const app = require('../../index')
const db = require('../../src/models')

let tempdb = db

beforeAll( async () => {
	await tempdb.sequelize.sync({ force: true, logging: false });
});

test('it gets all infotags', async () => {
	throw new Error('Finish the test!');
});

afterAll( async () => {
	await tempdb.sequelize.close()
});
