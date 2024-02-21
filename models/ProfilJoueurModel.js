const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const ProfilJoueur = sequelize.define(
    "ProfilJoueur",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      utilisateur_id: {
        type: DataTypes.INTEGER,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      prenom: DataTypes.STRING,
      nom: DataTypes.STRING,
      genre: DataTypes.ENUM("Homme", "Femme"),
      date_naissance: DataTypes.DATE,
      taille: DataTypes.INTEGER,
      ville: DataTypes.STRING,
      poste: DataTypes.STRING,
      pied_prefere: DataTypes.STRING,
      niveau: DataTypes.STRING,
      club_actuel: DataTypes.STRING,
      video_highlight: DataTypes.STRING,
      photo_profil: DataTypes.STRING,
    },
    {
      tableName: "profils_joueurs",
      timestamps: false,
    }
  );

  // Association avec la table utilisateurs
  ProfilJoueur.belongsTo(sequelize.models.User, {
    foreignKey: "utilisateur_id",
  });

  return ProfilJoueur;
};
