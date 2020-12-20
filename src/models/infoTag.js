const infoTag = (sequelize, DataTypes) => {
	const InfoTag = sequelize.define('infoTag', {
		text: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		}
	});

	InfoTag.associate = models => {
		InfoTag.belongsToMany(models.Pet, {
			through: 'PetInfoTags',
			as: 'pets',
			foreignKey: 'infoTagId',
			otherKey: 'petId'
		})

		InfoTag.belongsTo(models.InfoTagType);
	}

	return InfoTag;
};

module.exports = { infoTag };
