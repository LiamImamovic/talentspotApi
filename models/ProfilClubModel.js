const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProfilClub = sequelize.define(
    "ProfilClub",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      utilisateur_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      nom_profil: DataTypes.STRING,
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      tableName: "profils_clubs",
      timestamps: false,
    }
  );

  // Association avec la table utilisateurs
  ProfilClub.belongsTo(sequelize.models.User, {
    foreignKey: "utilisateur_id",
    onDelete: "CASCADE",
  });

  return ProfilClub;
};
