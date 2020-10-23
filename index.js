const express = require('express')
const app = express()

app.get('/', (req, res) => {
	res.send("Welcome to the online training journal!")
})

module.exports = app;
