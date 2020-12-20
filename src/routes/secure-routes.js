const express = require('express');
const router = express.Router();

const { models } = require('../models/index');

const { handlePetEdits } = require('../handlers/editPetHandler');
const { getUserPetById } = require('../handlers/getPetHandler');

const { serializePetIdResponse } = require('../serializers/petResponseSerializer');

router.get('/checkAuthentication', 
	(req, res, next) => {
		res.json({
			authenticated: true
		})
	});

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

router.get(
	'/profile/pets/:petid',
	async (req, res, next) => {
		const result = await getUserPetById(req.user.email, req.params.petid);

		const response = serializePetIdResponse(result);

		res.send(response);
	}
)

router.put('/profile/pets/:petid',
	async (req, res, next) => {
		const response = await handlePetEdits(req.user.email, req.params.petid, req.body);

		res.send(response);
	})

router.delete('/profile/pets/:petid', 
		async (req, res, next) => {
			const user = await models.User.findOne({ where: { email: req.user.email }});

			const pet = await models.Pet.findOne({
				where: { id: req.params.petid },
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

			await pet.destroy();
			next()
		}
)

module.exports = router;
