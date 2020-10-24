// Easy refactor. Move to separate config file(s) as environment variables grow.
require('dotenv').config()
const { models, sequelize } = require('./src/models');

const app = require('./index');

const port = process.env.PORT

module.exports = sequelize.sync().then(() => {
		app.listen(port, () => {
			console.log(`App listening on port ${port}`);
		});
	});
