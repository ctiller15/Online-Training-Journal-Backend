const { v4: uuidv4 } = require('uuid');
const request = require('supertest');
const app = require('../../index');

const parseHeaderCookie = (response) => {
	const cookies = {}

	const headerCookies = response.headers['set-cookie'];
	for(let cookie of headerCookies){
		const tempCookie = cookie.split('=');
		const cookieKey = tempCookie[0];
		const tempCookieVal = tempCookie[1].split(';');
		const cookieVal = tempCookieVal[0];
		
		cookies[cookieKey] = cookieVal;
	}

	return cookies;
}

exports.createUserToken = async () => {
	const payload = {
		email: `testUser${uuidv4()}@example.com`,
		password: `password`,
	}

	await request(app)
		.post('/signup')
		.send(payload)

	const response = await request(app)
		.post('/login')
		.send(payload)

	const headerCookie = parseHeaderCookie(response);

	token = response.body.token

	return headerCookie;
}
