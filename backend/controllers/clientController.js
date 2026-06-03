const User = require('../models/User');
const responseFormatter = require('../utils/responseFormatter');

const withoutPassword = (user) => {
  if (!user) return user;
  const { password_hash, ...safeUser } = user;
  return safeUser;
};

exports.getAll = async (req, res, next) => {
  try {
    const clients = await User.findByRole('client');
    res.json(responseFormatter(true, clients.map(withoutPassword), 'Liste des clients'));
  } catch (err) {
    next(err);
  }
};

exports.getById = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json(responseFormatter(false, null, 'Client non trouve'));
    }

    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = client.id === req.user.id;
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json(responseFormatter(false, null, 'Acces interdit'));
    }

    res.json(responseFormatter(true, withoutPassword(client), 'Details client'));
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json(responseFormatter(false, null, 'Client non trouve'));
    }

    const isAdmin = req.user.role === 'admin';
    const isOwnProfile = client.id === req.user.id;
    if (!isAdmin && !isOwnProfile) {
      return res.status(403).json(responseFormatter(false, null, 'Acces interdit'));
    }

    delete req.body.role;
    delete req.body.password_hash;
    delete req.body.email;

    await User.update(req.params.id, req.body);
    const updatedClient = await User.findById(req.params.id);
    res.json(responseFormatter(true, withoutPassword(updatedClient), 'Profil mis a jour'));
  } catch (err) {
    next(err);
  }
};

exports.remove = async (req, res, next) => {
  try {
    const client = await User.findById(req.params.id);
    if (!client) {
      return res.status(404).json(responseFormatter(false, null, 'Client non trouve'));
    }

    await User.remove(req.params.id);
    res.json(responseFormatter(true, null, 'Client supprime'));
  } catch (err) {
    next(err);
  }
};
