const { models } = require('../models');

const getUserPetById = async (email, petId) => {
	const user = await models.User.findOne({ where: { email: email }});

	const pet = await models.Pet.findOne({
		where: { id: petId },
		include: [{
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
		},
		{
			model: models.InfoTag,
			as: 'infoTags',
			include: [{ model: models.InfoTagType }]
		}]
	}).then(petResult => petResult && petResult.get({ plain: true }));

	return pet;
}

module.exports = { getUserPetById }
