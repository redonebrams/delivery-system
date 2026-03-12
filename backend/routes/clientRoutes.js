const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Routes réservées à l'admin
router.get('/', authMiddleware, roleMiddleware(['admin']), clientController.getAll);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), clientController.getById);

module.exports = router;
