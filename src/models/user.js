const bcrypt = require('bcrypt');

const user = (sequelize, DataTypes) => {
	const User = sequelize.define('user', {
		email: {
			type: DataTypes.STRING,
			unique: true,
			allowNull: false,
			validate: {
				isEmail: true,
			}
		},
		username: {
			type: DataTypes.STRING,
			allowNull: true,
		},
		password: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		}
	}, {
		hooks: {
			beforeCreate: async (user, options) => {
				const password = await bcrypt.hash(user.password, 10);
				user.password = password;
			}
		}
	});

	User.associate = models => {
		User.belongsToMany(models.Pet, { through: 'UserPets'});
	};
	
	User.prototype.isValidPassword = async function(password) {
		return await bcrypt.compare(password, this.password);
	}

	return User;
}

module.exports = { user };
