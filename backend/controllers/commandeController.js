const Commande = require('../models/Commande');
const StatutHistorique = require('../models/StatutHistorique');
const responseFormatter = require('../utils/responseFormatter');

exports.getAll = async (req,res,next) => {
  try {
    let commandes = [];
    
    // Filter commandes based on user role
    if (req.user.role === 'client') {
      commandes = await Commande.findByClient(req.user.id);
    } else if (req.user.role === 'livreur') {
      commandes = await Commande.findByLivreur(req.user.id);
    } else if (req.user.role === 'admin') {
      commandes = await Commande.getAll();
    }
    
    res.json(responseFormatter(true, commandes, 'Liste des commandes'));
  } catch(err){ next(err); }
};

exports.getById = async (req,res,next) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvée'));
    }
    
    // Check permissions: user can only see their own orders unless admin
    if (req.user.role === 'client' && commande.client_id !== req.user.id) {
      return res.status(403).json(responseFormatter(false, null, 'Accès interdit'));
    }
    
    res.json(responseFormatter(true, commande, 'Détails commande'));
  } catch(err){ next(err); }
};

exports.create = async (req,res,next) => {
  try {
    // Set client_id from authenticated user
    req.body.client_id = req.user.id;
    const id = await Commande.create(req.body);
    res.json(responseFormatter(true, {id}, 'Commande créée'));
  } catch(err){ next(err); }
};

exports.update = async (req,res,next) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvée'));
    }
    
    // Only admin can update orders
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Seul l\'administrateur peut mettre à jour une commande'));
    }
    
    await Commande.update(req.params.id, req.body);
    res.json(responseFormatter(true, null, 'Commande mise à jour'));
  } catch(err){ next(err); }
};

exports.remove = async (req,res,next) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvée'));
    }
    
    // Only admin can delete orders
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Seul l\'administrateur peut supprimer une commande'));
    }
    
    await Commande.remove(req.params.id);
    res.json(responseFormatter(true, null, 'Commande supprimée'));
  } catch(err){ next(err); }
};

exports.changeStatut = async (req,res,next) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvée'));
    }
    
    await Commande.updateStatut(req.params.id, statut);
    await StatutHistorique.add({
      commande_id: req.params.id,
      ancien_statut: commande.statut,
      nouveau_statut: statut,
      changed_by: req.user.id
    });
    res.json(responseFormatter(true, null, 'Statut changé'));
  } catch(err){ next(err); }
};

exports.assignLivreur = async (req,res,next) => {
  try {
    const { livreur_id } = req.body;
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvée'));
    }
    
    // Only admin can assign livreurs
    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Seul l\'administrateur peut assigner un livreur'));
    }
    
    await Commande.assignLivreur(req.params.id, livreur_id);
    res.json(responseFormatter(true, null, 'Livreur assigné'));
  } catch(err){ next(err); }
};

