const { Op, UniqueConstraintError, ValidationError } = require("sequelize");
const { ProfilJoueur, ProfilClub, User } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

exports.login = async (req, res) => {
  if (!req.body.email || !req.body.mot_de_passe) {
    const msg = "Veuillez fournir un email et un mot de passe.";
    return res.status(400).json({ message: msg });
  }

  try {
    // Utilisez la table "utilisateurs" (au lieu de "Users")
    const user = await User.findOne({ where: { email: req.body.email } });

    if (!user) {
      const msg = "L'utilisateur demandé n'existe pas.";
      return res.status(404).json({ message: msg });
    }

    const isValidPassword = await bcrypt.compare(
      req.body.mot_de_passe,
      user.mot_de_passe
    );

    if (!isValidPassword) {
      const msg = "Le mot de passe est incorrect.";
      return res.status(404).json({ message: msg });
    }

    let profileType;
    let profile;

    // Déterminez le type d'utilisateur (joueur ou club)
    if (user.type_utilisateur === "joueur") {
      profileType = ProfilJoueur;
    } else if (user.type_utilisateur === "club") {
      profileType = ProfilClub;
    }

    // Utilisez le type de profil correspondant
    profile = await profileType.findOne({ where: { utilisateur_id: user.id } });

    if (!profile) {
      const msg = "Le profil correspondant n'a pas été trouvé.";
      return res.status(404).json({ message: msg });
    }

    // json web token
    const token = jwt.sign(
      {
        data: user.id,
      },
      privateKey,
      { expiresIn: "24h" }
    );

    const msg = `L'utilisateur a été connecté avec succès en tant que ${user.type_utilisateur}.`;
    profile.mot_de_passe = "hidden";
    return res.json({ message: msg, user, profile, token });
  } catch (error) {
    const msg = "L'utilisateur n'a pas pu se connecter.";
    return res.status(500).json({ message: msg, error });
  }
};

exports.signup = async (req, res) => {
  try {
    // Vérifier si l'utilisateur avec cette adresse e-mail existe déjà
    const existingUser = await User.findOne({
      where: { email: req.body.email },
    });

    if (existingUser) {
      return res.status(409).json({
        message: "Cette adresse e-mail est déjà associée à un compte.",
      });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(req.body.mot_de_passe, 10);

    // Création de l'utilisateur
    const userCreated = await User.create({
      email: req.body.email,
      mot_de_passe: hashedPassword,
      type_utilisateur: req.body.type_utilisateur,
    });

    const message = `L'utilisateur ${userCreated.email} a bien été créé`;
    userCreated.mot_de_passe = "hidden";

    // Récupération de l'ID de l'utilisateur créé
    const utilisateur_id = userCreated.id;

    // Vérifier le type d'utilisateur et créer le profil correspondant
    if (req.body.type_utilisateur === "joueur") {
      const playerCreated = await ProfilJoueur.create({
        utilisateur_id: utilisateur_id,
        email: req.body.email,
        mot_de_passe: hashedPassword,
      });

      return res.json({
        message,
        data: { userCreated, playerCreated },
      });
    } else if (req.body.type_utilisateur === "club") {
      const clubCreated = await ProfilClub.create({
        utilisateur_id: utilisateur_id,
        nom_profil: req.body.nom_profil,
        email: req.body.email,
      });

      const message = `Le club ${clubCreated.email} a bien été créé`;
      clubCreated.mot_de_passe = "hidden";

      return res.json({
        message,
        data: { userCreated, clubCreated },
      });
    }
  } catch (error) {
    if (error.name === "SequelizeValidationError") {
      // Gérer d'autres erreurs de validation Sequelize
      return res.status(400).json({ message: error.message, data: error });
    }

    const message = "Un problème est survenu lors de la création du profil";
    return res.status(500).json({ message, data: error });
  }
};

exports.protect = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    const message = "Un jeton est nécessaire pour accéder à la ressource";
    return res.status(401).json({ message });
  }

  try {
    const token = authorizationHeader.split(" ")[1];
    const decoded = jwt.verify(token, privateKey);
    req.userId = decoded.data;
  } catch (err) {
    const message = "Jeton invalide";
    return res.status(403).json({ message, data: err });
  }

  return next();
};
