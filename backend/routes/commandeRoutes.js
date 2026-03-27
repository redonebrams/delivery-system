const express = require('express');
const router = express.Router();
const commandeController = require('../controllers/commandeController');
const authMiddleware = require('../middleware/authMiddleware');

// CRUD Commandes
router.get('/', authMiddleware, commandeController.getAll);
router.get('/:id', authMiddleware, commandeController.getById);
router.post('/', authMiddleware, commandeController.create);
router.put('/:id', authMiddleware, commandeController.update);
router.delete('/:id', authMiddleware, commandeController.remove);

// Actions spécifiques
router.patch('/:id/statut', authMiddleware, commandeController.changeStatut);
router.put('/:id/statut', authMiddleware, commandeController.changeStatut);
router.patch('/:id/assigner', authMiddleware, commandeController.assignLivreur);
router.put('/:id/assigner', authMiddleware, commandeController.assignLivreur);

module.exports = router;
