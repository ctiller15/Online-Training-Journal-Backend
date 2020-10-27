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

router.get(
	'/profile/pets',
	async (req, res, next) => {
		const user = await models.User.findOne({ where: { email: req.user.email }})

		const pets = await models.Pet.findAll({
			include: {
				model: models.User,
				where: {
					id: user.id
				},
				through: { 
					where: {
						userId: user.id
					}
				},
				as: 'users',
			}
		});

		return res.send(pets);
	}
);

router.post(
	'/profile/pets/new',
	async (req, res, next) => {
		const user = await models.User.findOne({ where: { email: req.user.email } })
		
		const newPet = await models.Pet.create({ name: req.body.name })
		
		await models.UserPet.create({ userId: user.id, petId: newPet.id})

		return res.send(newPet);
	}
);

module.exports = router;
