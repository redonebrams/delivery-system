const Livreur = require('../models/Livreur');
const responseFormatter = require('../utils/responseFormatter');

exports.getAll = async (req,res,next) => {
  try {
    // TODO: SELECT * FROM livreurs
    res.json(responseFormatter(true,[],'Liste des livreurs'));
  } catch(err){ next(err); }
};

exports.getById = async (req,res,next) => {
  try {
    const livreur = await Livreur.findById(req.params.id);
    res.json(responseFormatter(true,livreur,'Détails livreur'));
  } catch(err){ next(err); }
};

exports.create = async (req,res,next) => {
  try {
    const id = await Livreur.create(req.body);
    res.json(responseFormatter(true,{id},'Livreur créé'));
  } catch(err){ next(err); }
};

exports.update = async (req,res,next) => {
  try {
    // TODO: update livreur
    res.json(responseFormatter(true,null,'Livreur mis à jour'));
  } catch(err){ next(err); }
};

exports.remove = async (req,res,next) => {
  try {
    // TODO: delete livreur
    res.json(responseFormatter(true,null,'Livreur supprimé'));
  } catch(err){ next(err); }
};
