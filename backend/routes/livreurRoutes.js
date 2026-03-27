const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livreurController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// 🔥 Route PUBLIC de connexion pour les livreurs
router.post('/login', livreurController.login);

// Routes de livreurs (protégées)
router.get('/', livreurController.getAll);
router.get('/:id/deliveries', authMiddleware, livreurController.getDeliveries);
router.get('/:id/stats', authMiddleware, livreurController.getStats);
router.get('/:id', livreurController.getById);
router.post('/', authMiddleware, roleMiddleware('admin'), livreurController.create);
router.put('/:id', authMiddleware, roleMiddleware('admin'), livreurController.update);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), livreurController.remove);

module.exports = router;