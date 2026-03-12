const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const responseFormatter = require('../utils/responseFormatter');

exports.register = async (req, res, next) => {
  try {
    const { email, password, nom, prenom, telephone, role } = req.body;

    // Hash du mot de passe
    const hash = await bcrypt.hash(password, 10);

    // Création utilisateur
    const id = await User.create({
      email,
      password_hash: hash,
      role,
      nom,
      prenom,
      telephone
    });

    res.json(responseFormatter(true, { id }, 'Utilisateur créé'));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(404).json(responseFormatter(false, null, 'Utilisateur non trouvé'));
    }

    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json(responseFormatter(false, null, 'Mot de passe incorrect'));
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json(responseFormatter(true, { token }, 'Connexion réussie'));
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json(responseFormatter(false, null, 'Utilisateur non trouvé'));
    }
    res.json(responseFormatter(true, user, 'Utilisateur connecté'));
  } catch (err) {
    next(err);
  }
};
