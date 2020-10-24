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
		Pet.belongsToMany(models.User, { through: 'UserPets' });
	};

	return Pet;
};

module.exports = { pet };
