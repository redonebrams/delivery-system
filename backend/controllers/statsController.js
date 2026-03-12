const responseFormatter = require('../utils/responseFormatter');

exports.dashboard = async (req,res,next) => {
  try {
    // TODO: calculer stats globales
    res.json(responseFormatter(true,{totalCommandes:0,totalLivreurs:0},'Dashboard stats'));
  } catch(err){ next(err); }
};

exports.commandesParJour = async (req,res,next) => {
  try {
    // TODO: SELECT COUNT(*) GROUP BY DATE(created_at)
    res.json(responseFormatter(true,[],'Commandes par jour'));
  } catch(err){ next(err); }
};

exports.commandesParStatut = async (req,res,next) => {
  try {
    // TODO: SELECT COUNT(*) GROUP BY statut
    res.json(responseFormatter(true,[],'Commandes par statut'));
  } catch(err){ next(err); }
};

exports.commandesParType = async (req,res,next) => {
  try {
    // TODO: SELECT COUNT(*) GROUP BY type_commande
    res.json(responseFormatter(true,[],'Commandes par type'));
  } catch(err){ next(err); }
};
