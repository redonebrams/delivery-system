const Livreur = require('../models/Livreur');
const Commande = require('../models/Commande');
const User = require('../models/User');
const pool = require('../config/database');
const responseFormatter = require('../utils/responseFormatter');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 🔥 Nouvelle méthode: Login spécifique pour les livreurs
exports.login = async (req,res,next) => {
  try {
    const { email, password } = req.body;

    // Validation des données d'entrée
    if (!email || !password) {
      return res.status(400).json(responseFormatter(false, null, 'Email et mot de passe requis'));
    }

    // Chercher l'utilisateur avec le rôle 'livreur'
    const user = await User.findByEmail(email);
    
    if (!user) {
      return res.status(404).json(responseFormatter(false, null, 'Livreur non trouvé'));
    }

    // Vérifier que le compte est un livreur
    if (user.role !== 'livreur') {
      return res.status(403).json(responseFormatter(false, null, 'Accès réservé aux livreurs'));
    }

    // Vérifier que le compte est actif
    if (!user.is_active) {
      return res.status(403).json(responseFormatter(false, null, 'Compte désactivé. Contactez l\'administrateur'));
    }

    // Vérifier le mot de passe
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return res.status(401).json(responseFormatter(false, null, 'Mot de passe incorrect'));
    }

    // Générer le JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // Retourner les données sans le mot de passe
    const userData = {
      id: user.id,
      email: user.email,
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone,
      role: user.role,
      photo: user.photo
    };

    res.json(responseFormatter(true, { token, user: userData }, 'Connexion réussie'));
  } catch(err) { 
    next(err); 
  }
};

exports.getAll = async (req,res,next) => {
  try {
    const livreurs = await Livreur.getAll();
    res.json(responseFormatter(true, livreurs, 'Liste des livreurs'));
  } catch(err){ next(err); }
};

exports.getById = async (req,res,next) => {
  try {
    const livreur = await Livreur.findById(req.params.id);
    if (!livreur) {
      return res.status(404).json(responseFormatter(false, null, 'Livreur non trouvé'));
    }
    res.json(responseFormatter(true, livreur, 'Détails livreur'));
  } catch(err){ next(err); }
};

exports.create = async (req,res,next) => {
  try {
    // Only admin can create livreurs
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    const { nom, prenom, email, telephone, password, type_vehicule } = req.body;
    
    // Validation des champs requis
    if (!nom || !prenom || !email || !telephone || !password || !type_vehicule) {
      return res.status(400).json(responseFormatter(false, null, 'Tous les champs sont requis'));
    }
    
    // Vérifier si l'email existe déjà
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json(responseFormatter(false, null, 'Email déjà utilisé'));
    }
    
    // ÉTAPE 1: Créer l'utilisateur d'abord
    const bcrypt = require('bcryptjs');
    const passwordHash = await bcrypt.hash(password, 10);
    
    const userId = await User.create({
      email,
      password_hash: passwordHash,
      role: 'livreur',
      nom,
      prenom,
      telephone,
      photo: null
    });
    
    // ÉTAPE 2: Créer le livreur avec le user_id obtenu
    const livreurId = await Livreur.create({
      user_id: userId,
      type_vehicule
    });
    
    res.json(responseFormatter(true, {id: livreurId}, 'Livreur créé avec succès'));
  } catch(err){ next(err); }
};

exports.update = async (req,res,next) => {
  try {
    // Only admin can update livreurs
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    const livreur = await Livreur.findById(req.params.id);
    if (!livreur) {
      return res.status(404).json(responseFormatter(false, null, 'Livreur non trouvé'));
    }
    
    await Livreur.update(req.params.id, req.body);
    res.json(responseFormatter(true, null, 'Livreur mis à jour'));
  } catch(err){ next(err); }
};

exports.remove = async (req,res,next) => {
  try {
    // Only admin can delete livreurs
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    const livreur = await Livreur.findById(req.params.id);
    if (!livreur) {
      return res.status(404).json(responseFormatter(false, null, 'Livreur non trouvé'));
    }
    
    await Livreur.remove(req.params.id);
    res.json(responseFormatter(true, null, 'Livreur supprimé'));
  } catch(err){ next(err); }
};

exports.getDeliveries = async (req,res,next) => {
  try {
    // Get livreur info for authenticated user if role is livreur
    let livreur;
    if (req.user.role === 'livreur') {
      livreur = await Livreur.findByUserId(req.user.id);
    } else if (req.user.role === 'admin' && req.params.id) {
      livreur = await Livreur.findById(req.params.id);
    } else {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    if (!livreur) {
      return res.status(404).json(responseFormatter(false, null, 'Livreur non trouvé'));
    }
    
    const deliveries = await Commande.findByLivreur(livreur.id);
    res.json(responseFormatter(true, deliveries, 'Livraisons du livreur'));
  } catch(err){ next(err); }
};

exports.getStats = async (req,res,next) => {
  try {
    // Get livreur stats only for authenticated livreur or admin
    let livreur;
    if (req.user.role === 'livreur') {
      livreur = await Livreur.findByUserId(req.user.id);
    } else if (req.user.role === 'admin' && req.params.id) {
      livreur = await Livreur.findById(req.params.id);
    } else {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    if (!livreur) {
      return res.status(404).json(responseFormatter(false, null, 'Livreur non trouvé'));
    }
    
    // Get today's deliveries
    const [todayResult] = await pool.query(`
      SELECT COUNT(*) as count FROM commandes 
      WHERE livreur_id = ? AND DATE(created_at) = CURDATE()
    `, [livreur.id]);
    
    // Get total deliveries
    const [totalResult] = await pool.query(`
      SELECT COUNT(*) as count FROM commandes WHERE livreur_id = ?
    `, [livreur.id]);
    
    // Get ongoing deliveries
    const [ongoingResult] = await pool.query(`
      SELECT COUNT(*) as count FROM commandes 
      WHERE livreur_id = ? AND statut IN ('assignee', 'en_retrait', 'recuperee')
    `, [livreur.id]);
    
    const stats = {
      today: todayResult[0]?.count || 0,
      total: totalResult[0]?.count || 0,
      ongoing: ongoingResult[0]?.count || 0
    };
    
    res.json(responseFormatter(true, stats, 'Stats livreur'));
  } catch(err){ next(err); }
};


