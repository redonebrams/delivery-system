const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');

exports.getAll = async (req,res,next) => {
  try {
    // Only admin can list clients
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    const clients = await User.findByRole('client');
    res.json(responseFormatter(true, clients, 'Liste des clients'));
  } catch(err){ next(err); }
};

exports.getById = async (req,res,next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json(responseFormatter(false, null, 'Client non trouvé'));
    }
    
    // Check permissions
    if (req.user.role === 'client' && client.id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    res.json(responseFormatter(true, client, 'Détails client'));
  } catch(err){ next(err); }
};

exports.update = async (req,res,next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json(responseFormatter(false, null, 'Client non trouvé'));
    }
    
    // Check permissions - user can update their own profile, admin can update any
    if (req.user.id !== parseInt(req.params.id) && req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    // Don't allow changing role or password through this endpoint
    delete req.body.role;
    delete req.body.password_hash;
    delete req.body.email;
    
    await User.update(req.params.id, req.body);
    res.json(responseFormatter(true, null, 'Profil mis à jour'));
  } catch(err){ next(err); }
};

exports.remove = async (req,res,next) => {
  try {
    // Only admin can delete clients
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Seul l\'administrateur peut supprimer un client'));
    }
    
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json(responseFormatter(false, null, 'Client non trouvé'));
    }
    
    await User.remove(req.params.id);
    res.json(responseFormatter(true, null, 'Client supprimé'));
  } catch(err){ next(err); }
};


