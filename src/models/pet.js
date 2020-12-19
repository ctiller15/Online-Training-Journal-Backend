const pet = (sequelize, DataTypes) => {
	const Pet = sequelize.define('pet', {
		name: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,	
			},
		}
	});

	Pet.associate = models => {
		Pet.belongsToMany(models.User, { 
			through: 'UserPets', 
			as: 'users', 
			foreignKey: 'petId',
			otherKey: 'userId'
		});

		Pet.belongsToMany(models.InfoTag, {
			through: 'PetInfoTags',
			as: 'infoTags',
			foreignKey: 'petId',
			otherKey: 'infoTagId'
		});
	};

	return Pet;
};

module.exports = { pet };
