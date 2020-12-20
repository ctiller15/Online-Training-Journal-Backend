const { infoTagTypes } = require('../enums/petInfoTagTypes');

// this can likely be turned into a class instead.
//
const tagTypes = [
	infoTagTypes.likes, 
	infoTagTypes.fears, 
	infoTagTypes.tricks, 
	infoTagTypes.skills
];

const serializePetIdResponse = (petIdResponse) => {
	if(!petIdResponse) return petIdResponse;

	const newResponse = {};

	newResponse.id = petIdResponse.id;
	newResponse.name = petIdResponse.name;

	const tags = petIdResponse.infoTags;

	tagTypes.forEach((tag) => {
		newResponse[tag] = tags.filter(f => f.infoTagType.type === tag).map(m => ({id: m.id, text: m.text}));	
	});

	return newResponse;
}

module.exports = { serializePetIdResponse };
