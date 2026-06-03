const express = require('express');
const router = express.Router();
const testimonialController = require('../controllers/testimonialController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Public routes
router.get('/approved', testimonialController.getApproved);
router.get('/stats', testimonialController.getStats);

// Authenticated client routes
router.post('/', authMiddleware, testimonialController.create);
router.get('/user/my-testimonials', authMiddleware, testimonialController.getUserTestimonials);

// Admin routes
router.get('/admin/all', authMiddleware, roleMiddleware('admin'), testimonialController.getAll);
router.put('/:id', authMiddleware, roleMiddleware('admin'), testimonialController.update);
router.patch('/:id/approve', authMiddleware, roleMiddleware('admin'), testimonialController.approve);
router.patch('/:id/reject', authMiddleware, roleMiddleware('admin'), testimonialController.reject);
router.delete('/:id', authMiddleware, roleMiddleware('admin'), testimonialController.delete);

module.exports = router;
