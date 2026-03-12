const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livreurController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes réservées à l'admin
router.get('/', authMiddleware, roleMiddleware(['admin']), livreurController.getAll);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), livreurController.getById);
router.post('/', authMiddleware, roleMiddleware(['admin']), livreurController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), livreurController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), livreurController.remove);

module.exports = router;
