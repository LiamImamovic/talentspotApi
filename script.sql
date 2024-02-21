-- Table pour les utilisateurs (joueurs et clubs)
CREATE TABLE utilisateurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    mot_de_passe VARCHAR(255) NOT NULL,
    type_utilisateur ENUM('joueur', 'club') NOT NULL
);

-- Table pour les profils des joueurs
CREATE TABLE profils_joueurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    email VARCHAR(255) NOT NULL,  -- Ajout de la colonne email
    prenom VARCHAR(255),
    nom VARCHAR(255),
    genre ENUM('Homme', 'Femme'),
    date_naissance DATE,
    taille INT,
    ville VARCHAR(255),
    poste VARCHAR(255),
    pied_prefere VARCHAR(255),
    niveau VARCHAR(255),
    club_actuel VARCHAR(255),
    video_highlight VARCHAR(255),
    photo_profil VARCHAR(255),  -- Lien vers la photo de profil
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table pour les profils des clubs
CREATE TABLE profils_clubs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    utilisateur_id INT,
    email VARCHAR(255) NOT NULL,  -- Ajout de la colonne email
    nom_profil VARCHAR(255),
    FOREIGN KEY (utilisateur_id) REFERENCES utilisateurs(id)
);

-- Table pour les saisons des joueurs
CREATE TABLE saisons_joueur (
    id INT AUTO_INCREMENT PRIMARY KEY,
    profil_joueur_id INT,
    saison VARCHAR(255),
    club VARCHAR(255),
    FOREIGN KEY (profil_joueur_id) REFERENCES profils_joueurs(id)
);

-- Exemple d'insertion d'un joueur
INSERT INTO utilisateurs (email, mot_de_passe, type_utilisateur)
VALUES ('johndoe@gmail.com', 'motdepasse', 'joueur');

INSERT INTO profils_joueurs (utilisateur_id, email, prenom, nom, genre, date_naissance, taille, ville, poste, pied_prefere, niveau, club_actuel, video_highlight, photo_profil)
VALUES (1, 'johndoe@gmail.com', 'John', 'Doe', 'Homme', '2001-05-12', 198, 'Bordeaux', 'Gardien de but', 'Gauche', 'Nationale 3', 'Andernos Sport FC', 'Youtube URL', 'lien_photo_profil');

INSERT INTO saisons_joueur (profil_joueur_id, saison, club)
VALUES (1, '2022-2023', 'USLCF'),
       (1, '2021-2022', 'Union College'),
       (1, '2020-2021', 'Union College'),
       (1, '2019-2020', 'USLCF'),
       (1, '2018-2019', 'FCEMA/USLCF');

-- Exemple d'insertion d'un club
INSERT INTO utilisateurs (email, mot_de_passe, type_utilisateur)
VALUES ('club@example.com', 'motdepasse', 'club');

INSERT INTO profils_clubs (utilisateur_id, email, nom_profil)
VALUES (2, 'club@example.com', 'Nom du Club');
