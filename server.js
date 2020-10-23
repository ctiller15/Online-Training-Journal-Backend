const app = require('./index');

// Easy refactor. Move to separate config file(s) as environment variables grow.
require('dotenv').config()

const port = process.env.PORT

module.exports = app.listen(port, () => {
	console.log(`App listening on port ${port}`)
})
