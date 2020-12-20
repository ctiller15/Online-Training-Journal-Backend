const seedInfoTagType = async ( db ) => {
	await db.models.InfoTagType.bulkCreate([
		{
			type: 'likes'	
		},
		{
			type: 'fears'
		},
		{
			type: 'tricks'
		},
		{
			type: 'skills'
		}
	]);
}

module.exports = { seedInfoTagType };
