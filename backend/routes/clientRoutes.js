const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.get('/', authMiddleware, roleMiddleware(['admin']), clientController.getAll);
router.get('/:id', authMiddleware, clientController.getById);
router.put('/:id', authMiddleware, clientController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), clientController.remove);

module.exports = router;
