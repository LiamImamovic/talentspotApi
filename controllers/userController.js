const { Op, UniqueConstraintError, ValidationError } = require("sequelize");
const { ProfilJoueur, ProfilClub } = require("../db/sequelize");

exports.findAllUsers = (req, res) => {
  ProfilJoueur.findAll()
    .then((joueurs) => {
      ProfilClub.findAll()
        .then((clubs) => {
          const users = {
            joueurs: joueurs,
            clubs: clubs,
          };
          res.json(users);
        })
        .catch((error) => {
          console.error(error);
          res
            .status(500)
            .json({ message: "Erreur lors de la récupération des clubs." });
        });
    })
    .catch((error) => {
      console.error(error);
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des joueurs." });
    });
};
