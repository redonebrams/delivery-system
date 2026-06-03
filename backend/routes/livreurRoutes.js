const express = require('express');
const router = express.Router();
const livreurController = require('../controllers/livreurController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

router.post('/login', livreurController.login);

router.get('/me/deliveries', authMiddleware, roleMiddleware(['livreur']), livreurController.getDeliveries);
router.get('/me/stats', authMiddleware, roleMiddleware(['livreur']), livreurController.getStats);

router.get('/', authMiddleware, roleMiddleware(['admin']), livreurController.getAll);
router.get('/:id/deliveries', authMiddleware, roleMiddleware(['admin']), livreurController.getDeliveries);
router.get('/:id/stats', authMiddleware, roleMiddleware(['admin']), livreurController.getStats);
router.get('/:id', authMiddleware, roleMiddleware(['admin']), livreurController.getById);
router.post('/', authMiddleware, roleMiddleware(['admin']), livreurController.create);
router.put('/:id', authMiddleware, roleMiddleware(['admin']), livreurController.update);
router.delete('/:id', authMiddleware, roleMiddleware(['admin']), livreurController.remove);

module.exports = router;
