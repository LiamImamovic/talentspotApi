// sequelize.js
const { Sequelize } = require("sequelize");
const UserModel = require("../models/UserModel");
const ProfilJoueurModel = require("../models/ProfilJoueurModel");
const ProfilClubModel = require("../models/ProfilClubModel");

const sequelize = new Sequelize("tslife", "root", "root", {
  host: "localhost",
  dialect: "mysql",
  port: "8889",
});

const User = UserModel(sequelize);
const ProfilJoueur = ProfilJoueurModel(sequelize);
const ProfilClub = ProfilClubModel(sequelize);

// Associations
User.hasOne(ProfilJoueur, { foreignKey: "utilisateur_id" });
User.hasOne(ProfilClub, { foreignKey: "utilisateur_id" });

module.exports = {
  sequelize,
  User,
  ProfilJoueur,
  ProfilClub,
  initDb: async () => {
    console.log("Database initialized");
  },
};
