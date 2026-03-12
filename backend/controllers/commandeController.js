const Commande = require('../models/Commande');
const StatutHistorique = require('../models/StatutHistorique');
const responseFormatter = require('../utils/responseFormatter');

exports.getAll = async (req,res,next) => {
  try {
    // Selon rôle, filtrer les commandes
    const commandes = []; // TODO: requête SELECT selon req.user.role
    res.json(responseFormatter(true,commandes,'Liste des commandes'));
  } catch(err){ next(err); }
};

exports.getById = async (req,res,next) => {
  try {
    const commande = await Commande.findById(req.params.id);
    res.json(responseFormatter(true,commande,'Détails commande'));
  } catch(err){ next(err); }
};

exports.create = async (req,res,next) => {
  try {
    const id = await Commande.create(req.body);
    res.json(responseFormatter(true,{id},'Commande créée'));
  } catch(err){ next(err); }
};

exports.update = async (req,res,next) => {
  try {
    // TODO: update commande
    res.json(responseFormatter(true,null,'Commande mise à jour'));
  } catch(err){ next(err); }
};

exports.remove = async (req,res,next) => {
  try {
    // TODO: delete commande
    res.json(responseFormatter(true,null,'Commande supprimée'));
  } catch(err){ next(err); }
};

exports.changeStatut = async (req,res,next) => {
  try {
    const { statut } = req.body;
    const commande = await Commande.findById(req.params.id);
    await Commande.updateStatut(req.params.id,statut);
    await StatutHistorique.add({
      commande_id:req.params.id,
      ancien_statut:commande.statut,
      nouveau_statut:statut,
      changed_by:req.user.id
    });
    res.json(responseFormatter(true,null,'Statut changé'));
  } catch(err){ next(err); }
};

exports.assignLivreur = async (req,res,next) => {
  try {
    const { livreur_id } = req.body;
    await Commande.assignLivreur(req.params.id,livreur_id);
    res.json(responseFormatter(true,null,'Livreur assigné'));
  } catch(err){ next(err); }
};
