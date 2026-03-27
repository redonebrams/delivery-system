const pool = require('../config/database');
const Setting = require('../models/Setting');
const responseFormatter = require('../utils/responseFormatter');

exports.dashboard = async (req,res,next) => {
  try {
    // Get total orders
    const [totalResult] = await pool.query('SELECT COUNT(*) as total FROM commandes');
    const totalCommandes = totalResult[0]?.total || 0;
    
    // Get orders today
    const [todayResult] = await pool.query(`
      SELECT COUNT(*) as total FROM commandes WHERE DATE(created_at) = CURDATE()
    `);
    const todayCommandes = todayResult[0]?.total || 0;
    
    // Get ongoing orders
    const [ongoingResult] = await pool.query(`
      SELECT COUNT(*) as total FROM commandes WHERE statut IN ('assignee', 'en_retrait', 'recuperee')
    `);
    const ongoingCommandes = ongoingResult[0]?.total || 0;
    
    // Get total livreurs
    const [livreurResult] = await pool.query(`
      SELECT COUNT(*) as total FROM livreurs WHERE statut = 'disponible'
    `);
    const activeLivreurs = livreurResult[0]?.total || 0;
    
    // Get total revenue
    const [revenueResult] = await pool.query(`
      SELECT SUM(prix_livraison) as total FROM commandes WHERE statut = 'livree'
    `);
    const totalRevenue = revenueResult[0]?.total || 0;
    
    const stats = {
      totalCommandes,
      todayOrders: todayCommandes,
      ongoingOrders: ongoingCommandes,
      activeLivreurs,
      revenue: totalRevenue
    };
    
    res.json(responseFormatter(true, stats, 'Dashboard stats'));
  } catch(err){ next(err); }
};

exports.commandesParJour = async (req,res,next) => {
  try {
    const [result] = await pool.query(`
      SELECT DATE(created_at) as date, COUNT(*) as count
      FROM commandes
      WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      GROUP BY DATE(created_at)
      ORDER BY DATE(created_at)
    `);
    res.json(responseFormatter(true, result, 'Commandes par jour'));
  } catch(err){ next(err); }
};

exports.commandesParStatut = async (req,res,next) => {
  try {
    const [result] = await pool.query(`
      SELECT statut, COUNT(*) as count
      FROM commandes
      GROUP BY statut
    `);
    res.json(responseFormatter(true, result, 'Commandes par statut'));
  } catch(err){ next(err); }
};

exports.commandesParType = async (req,res,next) => {
  try {
    const [result] = await pool.query(`
      SELECT type_commande, COUNT(*) as count
      FROM commandes
      GROUP BY type_commande
    `);
    res.json(responseFormatter(true, result, 'Commandes par type'));
  } catch(err){ next(err); }
};

exports.getTarifs = async (req,res,next) => {
  try {
    const tarifs = await Setting.getAll();
    const tarifObj = {};
    tarifs.forEach(t => {
      tarifObj[t.cle] = parseFloat(t.valeur);
    });
    res.json(responseFormatter(true, tarifObj, 'Tarifs récupérés'));
  } catch(err){ next(err); }
};

exports.updateTarifs = async (req,res,next) => {
  try {
    // Update each tarif in the request
    for (const [cle, valeur] of Object.entries(req.body)) {
      await Setting.set(cle, valeur.toString(), 'Valeur mise à jour');
    }
    res.json(responseFormatter(true, null, 'Tarifs mis à jour'));
  } catch(err){ next(err); }
};


