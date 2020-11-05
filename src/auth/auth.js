const passport = require('passport');
const localStrategy = require('passport-local').Strategy;
const JWTstrategy = require('passport-jwt').Strategy;

const { models } = require('../models/index');

const cookieExtractor = req => {
	let jwt = null

	if (req && req.cookies) {
		jwt = req.cookies['jwt']
	}

	return jwt
}

passport.use(
	'signup',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await models.User.create(
					{
						email: email,
						password: password,
					}
				);

				return done(null, user);
			} catch (error) {
				done(error);
			}
		}
	)
);

passport.use(
	'login',
	new localStrategy(
		{
			usernameField: 'email',
			passwordField: 'password'
		},
		async (email, password, done) => {
			try {
				const user = await models.User.findOne(
					{
						where: { email: email }
					}
				);

				if(!user) {
					return done(null, false, { responseCode: 404, message: 'User not found' });
				}

				const validate = await user.isValidPassword(password);

				if(!validate) {
					return done(null, false, { responseCode: 401, message: 'Incorrect Password' });
				}

				return done(null, user, { message: 'Logged in Successfully' });
			} catch (error) {
				return done(error);
			}
		}
	)
);

passport.use('jwt',
	new JWTstrategy(
		{
			secretOrKey: process.env.SECRET_KEY,
			jwtFromRequest: cookieExtractor
		},
		async (jwtPayload, done) => {
			try {
				return done(null, jwtPayload.user);
			} catch (error) {

				done(error);
			}
		}
	)
);
