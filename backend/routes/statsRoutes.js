const express = require('express');
const router = express.Router();
const statsController = require('../controllers/statsController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Statistiques générales (admin)
router.get('/dashboard', authMiddleware, roleMiddleware(['admin']), statsController.dashboard);
router.get('/commandes-par-jour', authMiddleware, roleMiddleware(['admin']), statsController.commandesParJour);
router.get('/commandes-par-statut', authMiddleware, roleMiddleware(['admin']), statsController.commandesParStatut);
router.get('/commandes-par-type', authMiddleware, roleMiddleware(['admin']), statsController.commandesParType);

// Tarifs/Settings endpoints
router.get('/tarifs', authMiddleware, roleMiddleware(['admin']), statsController.getTarifs);
router.put('/tarifs', authMiddleware, roleMiddleware(['admin']), statsController.updateTarifs);

module.exports = router;
