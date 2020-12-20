const Sequelize = require('sequelize');

const sequelize = new Sequelize(
	process.env.DATABASE,
	process.env.DATABASE_USER,
	process.env.DATABASE_PASSWORD,
	{
		dialect: 'postgres',
		logging: process.env.NODE_ENV !== 'test'
	},
);

const models = {
	User: require('./user').user(sequelize, Sequelize),
	Pet: require('./pet').pet(sequelize, Sequelize),
	UserPet: require('./userpets').userPets(sequelize, Sequelize),
	InfoTag: require('./infoTag').infoTag(sequelize, Sequelize),
	PetInfoTags: require('./petInfoTags').petInfoTags(sequelize, Sequelize),
	InfoTagType: require('./infoTagTypes').infoTagType(sequelize, Sequelize),
};

Object.keys(models).forEach(key => {
	if ('associate' in models[key]) {
		models[key].associate(models);
	}
});

module.exports = { models, sequelize };
