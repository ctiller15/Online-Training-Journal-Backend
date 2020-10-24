const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		dialect: 'postgres',
	},
);

const models = {
	User: require('./user').user(sequelize, Sequelize),
	Pet: require('./pet').pet(sequelize, Sequelize),
};

Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

module.exports = { models, sequelize };
