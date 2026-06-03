const Commande = require('../models/Commande');
const Livreur = require('../models/Livreur');
const StatutHistorique = require('../models/StatutHistorique');
const responseFormatter = require('../utils/responseFormatter');

const VALID_STATUSES = ['en_attente', 'assignee', 'en_retrait', 'recuperee', 'livree', 'annulee'];
const LIVREUR_STATUSES = ['en_retrait', 'recuperee', 'livree', 'annulee'];

const normalizeStatus = (statut) =>
  String(statut || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/\s+/g, '_');

const isOwnerClient = (req, commande) => req.user.role === 'client' && commande.client_id === req.user.id;

const getAuthenticatedLivreur = async (req) => {
  if (req.user.role !== 'livreur') return null;
  return Livreur.findByUserId(req.user.id);
};

const canAccessCommande = async (req, commande) => {
  if (req.user.role === 'admin') return true;
  if (isOwnerClient(req, commande)) return true;

  const livreur = await getAuthenticatedLivreur(req);
  return Boolean(livreur && commande.livreur_id === livreur.id);
};

const validateCreatePayload = (body) => {
  const requiredFields = [
    'type_commande',
    'nom_retrait',
    'telephone_retrait',
    'adresse_retrait',
    'nom_livraison',
    'telephone_livraison',
    'adresse_livraison',
    'distance_km',
    'prix_livraison',
    'mode_paiement'
  ];

  const missing = requiredFields.filter((field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === '');
  if (missing.length) return `Champs requis manquants: ${missing.join(', ')}`;

  if (Number(body.distance_km) <= 0) return 'La distance doit etre superieure a 0';
  if (Number(body.prix_livraison) < 0) return 'Le prix de livraison est invalide';

  return null;
};

exports.getAll = async (req, res, next) => {
  try {
    let commandes = [];

    if (req.user.role === 'client') {
      commandes = await Commande.findByClient(req.user.id);
    } else if (req.user.role === 'livreur') {
      const livreur = await getAuthenticatedLivreur(req);
      commandes = livreur ? await Commande.findByLivreur(livreur.id) : [];
    } else if (req.user.role === 'admin') {
      commandes = await Commande.getAll();
    }

    res.json(responseFormatter(true, commandes, 'Liste des commandes'));
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvee'));
    }

    if (!(await canAccessCommande(req, commande))) {
      return res.status(403).json(responseFormatter(false, null, 'Acces interdit'));
    }

    res.json(responseFormatter(true, commande, 'Details commande'));
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    if (req.user.role !== 'client') {
      return res.status(403).json(responseFormatter(false, null, 'Seul un client peut creer une commande'));
    }

    const validationError = validateCreatePayload(req.body);
    if (validationError) {
      return res.status(400).json(responseFormatter(false, null, validationError));
    }

    req.body.client_id = req.user.id;
    req.body.livreur_id = null;
    req.body.statut = 'en_attente';

    const id = await Commande.create(req.body);
    res.status(201).json(responseFormatter(true, { id }, 'Commande creee'));
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvee'));
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Seul l administrateur peut mettre a jour une commande'));
    }

    await Commande.update(req.params.id, req.body);
    res.json(responseFormatter(true, null, 'Commande mise a jour'));
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvee'));
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Seul l administrateur peut supprimer une commande'));
    }

    await Commande.remove(req.params.id);
    res.json(responseFormatter(true, null, 'Commande supprimee'));
  } catch (err) {
    next(err);
  }
};

exports.changeStatut = async (req, res, next) => {
  try {
    const statut = normalizeStatus(req.body.statut);
    if (!VALID_STATUSES.includes(statut)) {
      return res.status(400).json(responseFormatter(false, null, 'Statut invalide'));
    }

    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvee'));
    }

    if (req.user.role === 'client') {
      const currentStatus = normalizeStatus(commande.statut);
      if (!isOwnerClient(req, commande) || currentStatus !== 'en_attente' || statut !== 'annulee') {
        return res.status(403).json(responseFormatter(false, null, 'Le client peut seulement annuler sa commande en attente'));
      }
    } else if (req.user.role === 'livreur') {
      const livreur = await getAuthenticatedLivreur(req);
      if (!livreur || commande.livreur_id !== livreur.user_id || !LIVREUR_STATUSES.includes(statut)) {
        return res.status(403).json(responseFormatter(false, null, 'Acces interdit'));
      }
    } else if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Acces interdit'));
    }

    await Commande.updateStatut(req.params.id, statut);
    await StatutHistorique.add({
      commande_id: req.params.id,
      ancien_statut: commande.statut,
      nouveau_statut: statut,
      changed_by: req.user.id
    });

    res.json(responseFormatter(true, null, 'Statut change'));
  } catch (err) {
    next(err);
  }
};

exports.assignLivreur = async (req, res, next) => {
  try {
    const { livreur_id } = req.body;
    const commande = await Commande.findById(req.params.id);
    if (!commande) {
      return res.status(404).json(responseFormatter(false, null, 'Commande non trouvee'));
    }

    if (req.user.role !== 'admin') {
      return res.status(403).json(responseFormatter(false, null, 'Seul l administrateur peut assigner un livreur'));
    }

    const livreur = await Livreur.findById(livreur_id);
    if (!livreur) {
      return res.status(404).json(responseFormatter(false, null, 'Livreur non trouve'));
    }

    await Commande.assignLivreur(req.params.id, livreur.user_id);
    await Commande.updateStatut(req.params.id, 'assignee');
    res.json(responseFormatter(true, null, 'Livreur assigne'));
  } catch (err) {
    next(err);
  }
};
