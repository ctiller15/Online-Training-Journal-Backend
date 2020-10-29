const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');

const router = express.Router();

router.post(
	'/signup',
	passport.authenticate('signup', { session: false }),
	async (req, res, next) => {
		res.json({
			message: 'Signup successful',
			user: req.user
		});
	}
);

router.post(
	'/login',
	async (req, res, next) => {
		passport.authenticate(
			'login',
			async (err, user, info) => {
				try {
					if (err || !user){
						const error = new Error(info.message);
						return res.status(info.responseCode).json({ error: error.message } );
					}

					req.login(
						user,
						{ session: false },
						async (error) => {
							if (error) {
								return next(error);
							}

							const body = { _id: user._id, email: user.email };
							const token = jwt.sign(
								{ user: body },
								process.env.SECRET_KEY,
								{ expiresIn: '24h' }
						);

							return res
								.cookie('jwt', token, {
									httpOnly: true,
									secure: process.env.NODE_ENV === 'production',
									expires: new Date(Date.now() + 24 * 3600000)
								})
								.status(200)
								.json({ token });
						}
					);

				} catch (error) {
					return next(error);
				}
			}
		)(req, res, next);
	}
);

router.post('/logout', 
	async (req, res, next) => {

		// Here, we force the cookie to expire.
		if(req.cookies['jwt']){
			res
				.clearCookie('jwt')
				.status(200)
				.json({
					message: 'You have logged out!'
				})
		}
		else {
			res.status(401).send()
		}
		next();
	}
)

module.exports = router;
