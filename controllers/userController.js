const { sequelize, Op } = require("../db/sequelize");
const { ProfilJoueur, ProfilClub, User } = require("../db/sequelize");

exports.findAllUsers = async (req, res) => {
  try {
    const users = await sequelize.query(
      `
      SELECT
        u.id AS utilisateur_id,
        u.email,
        u.premium,
        'joueur' AS type
      FROM
        utilisateurs u
        LEFT JOIN profils_joueurs pj ON u.id = pj.utilisateur_id
      
      UNION
      
      SELECT
        u.id AS utilisateur_id,
        u.email,
        u.premium,
        'club' AS type
      FROM
        utilisateurs u
        LEFT JOIN profils_clubs pc ON u.id = pc.utilisateur_id
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(users);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la récupération des utilisateurs." });
  }
};

exports.findPremiumUsers = async (req, res) => {
  try {
    const premiumUsers = await sequelize.query(
      `
      SELECT
      DISTINCT u.id AS utilisateur_id,
        u.email,
        u.premium,
        'joueur' AS type
      FROM
        utilisateurs u
        LEFT JOIN profils_joueurs pj ON u.id = pj.utilisateur_id
      WHERE
        u.premium = true

      UNION
      
      SELECT
      DISTINCT u.id AS utilisateur_id,
        u.email,
        u.premium,
        'club' AS type
      FROM
        utilisateurs u
        LEFT JOIN profils_clubs pc ON u.id = pc.utilisateur_id
      WHERE
        u.premium = true
    `,
      {
        type: sequelize.QueryTypes.SELECT,
      }
    );

    res.json(premiumUsers);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs premium.",
    });
  }
};

exports.deleteUser = async (req, res) => {
  const utilisateurId = req.params.id;

  try {
    await ProfilJoueur.destroy({ where: { utilisateur_id: utilisateurId } });
    await ProfilClub.destroy({ where: { utilisateur_id: utilisateurId } });
    const deletedUser = await User.destroy({ where: { id: utilisateurId } });

    if (deletedUser === 0) {
      res.status(404).json({ message: "Utilisateur non trouvé." });
    } else {
      res.json({ message: "Utilisateur supprimé avec succès." });
    }
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Erreur lors de la suppression de l'utilisateur." });
  }
};
