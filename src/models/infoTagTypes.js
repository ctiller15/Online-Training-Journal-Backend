const infoTagType = (sequelize, DataTypes) => {
	const InfoTagType = sequelize.define('infoTagType', {
		type: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
			}
		}
	});

	InfoTagType.associate = models => {
		InfoTagType.hasMany(models.InfoTag)
	}

	return InfoTagType;
}

module.exports = { infoTagType }
