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
      telephone,
      photo: null
    });

    res.json(responseFormatter(true, { id }, 'Utilisateur créé'));
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validation des données d'entrée
    if (!email || !password) {
      return res.status(400).json(responseFormatter(false, null, 'Email et mot de passe requis'));
    }

    console.log(`🔍 Attempting login for: ${email}`);

    let user;
    try {
      user = await User.findByEmail(email);
    } catch (dbErr) {
      console.error('❌ Database error during findByEmail:', dbErr.message);
      return res.status(503).json(responseFormatter(false, null, 'Erreur de base de données. Veuillez réessayer.'));
    }

    if (!user) {
      console.log(`⚠️ User not found: ${email}`);
      return res.status(404).json(responseFormatter(false, null, 'Utilisateur non trouvé'));
    }

    // 🔥 NOUVELLE VÉRIFICATION: Compte actif?
    if (!user.is_active) {
      console.log(`⚠️ Account inactive: ${email}`);
      return res.status(403).json(responseFormatter(false, null, 'Compte désactivé. Contactez l\'administrateur'));
    }

    let match;
    try {
      match = await bcrypt.compare(password, user.password_hash);
    } catch (bcryptErr) {
      console.error('❌ Bcrypt error:', bcryptErr.message);
      return res.status(500).json(responseFormatter(false, null, 'Erreur lors de la vérification du mot de passe'));
    }

    if (!match) {
      console.log(`⚠️ Incorrect password for: ${email}`);
      return res.status(401).json(responseFormatter(false, null, 'Mot de passe incorrect'));
    }

    // Génération du token JWT
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Return user data without password
    const userData = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone,
      role: user.role,
      photo: user.photo
    };

    console.log(`✅ Successful login for: ${email} (Role: ${user.role})`);
    res.json(responseFormatter(true, { token, user: userData }, 'Connexion réussie'));
  } catch (err) {
    console.error('❌ Unexpected error in login:', err);
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json(responseFormatter(false, null, 'Utilisateur non trouvé'));
    }
    
    // Remove password from response
    const { password_hash, ...userData } = user;
    
    res.json(responseFormatter(true, userData, 'Utilisateur connecté'));
  } catch (err) {
    next(err);
  }
};

