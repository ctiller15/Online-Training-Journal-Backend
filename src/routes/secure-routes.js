const express = require('express');
const router = express.Router();

const { models } = require('../models/index');

router.get(
	'/profile',
	(req, res, next) => {
		res.json({
			message: 'You made it to the secure route!',
			user: req.user,
		})
	}
);

router.post(
	'/profile/pets/new',
	async (req, res, next) => {
		const user = await models.User.findOne({ where: { email: req.user.email } })
		
		const newPet = await models.Pet.create({ name: req.body.name })
		
		await user.setPets(newPet);
		return res.send(newPet);
	}
);

module.exports = router;
