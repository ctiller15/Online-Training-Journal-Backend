const petInfoTags = (sequelize, DataTypes) => {
	const PetInfoTags = sequelize.define('PetInfoTags', {
		petId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Pets',
				key: 'id',
			}
		},
		infoTagId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'InfoTags',
				key: 'id',
			}
		}
	});

	return PetInfoTags;
}

module.exports = { petInfoTags };
