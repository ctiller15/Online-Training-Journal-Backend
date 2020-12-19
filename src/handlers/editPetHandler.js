const { models } = require('../models/index');

const handlePetEdits = async (userEmail, petId, body) => {
	const { name, infoTags } = body;

	const user = await models.User.findOne({ where: { email: userEmail }});

	const pet = await models.Pet.findOne({
		where: { id: petId },
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

	await pet.update(
		{name: name}
	);

	// create tags
	if(infoTags) {
		const newTags = infoTags.filter(tag => !tag.id);

		const returnedInfoTags = await models.InfoTag.bulkCreate(newTags, {returning: true})
			.then((createdValues) => {
				// then bulk insert into many to many table.
				return createdValues;
			});

		const petInfoTags = returnedInfoTags.map(m => ({petId: petId, infoTagId: m.id}));

		await models.PetInfoTags.bulkCreate(petInfoTags, { returning: true})
			.then((createdValues) => {
				return createdValues;
			});
	}
	
	return pet;
}

module.exports = { handlePetEdits };
