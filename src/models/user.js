const user = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		username: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				notEmpty: true,
			},
		},
	});

	User.associate = models => {
		console.log(models);
		User.belongsToMany(models.Pet, { through: 'UserPets'});
	};

	return User;
}

module.exports = { user };
