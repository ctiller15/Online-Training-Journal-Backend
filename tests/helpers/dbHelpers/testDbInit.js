const { seedInfoTagType } = require('./seedHelpers/infoTagTypeSeed');

const initializeDatabase = async (db) => {
	await db.sequelize.sync({ force: true, logging: false })
		.then(() => {
			seedInfoTagType(db);
		});
}

module.exports = { initializeDatabase }
