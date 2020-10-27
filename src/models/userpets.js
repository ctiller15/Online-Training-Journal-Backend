const userPets = (sequelize, DataTypes) => {
	const UserPets = sequelize.define('UserPets', {
		userId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Users',
				key: 'id'
			}
		},
		petId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'Pets',
				key: 'id'
			}
		}
	});

	return UserPets;
}

module.exports = { userPets };
