const express = require('express');
const passport = require('passport');
const bodyParser = require('body-parser');

const UserModel = require('./src/models/user');

require('./src/auth/auth');

const routes = require('./src/routes/routes');
const secureRoute = require('./src/routes/secure-routes')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/', routes);

app.use('/user', passport.authenticate('jwt', { session: false }), secureRoute);

app.use(function(err, req, res, next) {
	res.status(err.status || 500);
	res.json({ error: err });
});

app.get('/', (req, res) => {
	res.send("Welcome to the online training journal!")
})

module.exports = app;
