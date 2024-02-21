// UserModel.js
const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type_utilisateur: {
        type: DataTypes.ENUM("joueur", "club", "admin"),
        allowNull: false,
      },
    },
    {
      tableName: "utilisateurs",
      timestamps: false,
    }
  );

  return User;
};
