const Testimonial = require('../models/Testimonial');
const responseFormatter = require('../utils/responseFormatter');
const validator = require('../utils/validator');

const STATUS_VALUES = ['pending', 'approved', 'rejected'];

// Get all approved testimonials
exports.getApproved = async (req, res) => {
  try {
    const testimonials = await Testimonial.getApproved();
    const stats = await Testimonial.getAverageRating();
    res.json(
      responseFormatter(true, { testimonials, stats }, 'Témoignages récupérés avec succès')
    );
  } catch (err) {
    console.error('Error fetching testimonials:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de la récupération des témoignages'));
  }
};

// Get all testimonials (admin)
exports.getAll = async (req, res) => {
  try {
    const testimonials = await Testimonial.getAll();
    res.json(responseFormatter(true, testimonials, 'Tous les témoignages récupérés'));
  } catch (err) {
    console.error('Error fetching all testimonials:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de la récupération des témoignages'));
  }
};

// Get user's testimonials
exports.getUserTestimonials = async (req, res) => {
  try {
    const userId = req.user.id;
    const testimonials = await Testimonial.getByUserId(userId);
    res.json(responseFormatter(true, testimonials, 'Témoignages de l\'utilisateur récupérés'));
  } catch (err) {
    console.error('Error fetching user testimonials:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de la récupération des témoignages'));
  }
};

// Create new testimonial
exports.create = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json(responseFormatter(false, null, 'La note doit être entre 1 et 5'));
    }

    if (!comment || comment.trim().length === 0) {
      return res.status(400).json(responseFormatter(false, null, 'Le commentaire est requis'));
    }

    if (comment.trim().length < 10) {
      return res.status(400).json(responseFormatter(false, null, 'Le commentaire doit contenir au moins 10 caractères'));
    }

    if (comment.trim().length > 500) {
      return res.status(400).json(responseFormatter(false, null, 'Le commentaire ne doit pas dépasser 500 caractères'));
    }

    const userTestimonials = await Testimonial.getByUserId(userId);
    const hasPending = userTestimonials.some(t => t.status === 'pending');

    if (hasPending) {
      return res.status(400).json(responseFormatter(false, null, 'Vous avez un témoignage en attente d\'approbation'));
    }

    const testimonialId = await Testimonial.create(userId, rating, comment.trim());

    res.status(201).json(
      responseFormatter(true, { id: testimonialId }, 'Témoignage soumis avec succès. Il sera examiné par notre équipe.')
    );
  } catch (err) {
    console.error('Error creating testimonial:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de la création du témoignage'));
  }
};

// Update testimonial (admin)
exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, comment, status } = req.body;

    if (rating !== undefined && (rating < 1 || rating > 5)) {
      return res.status(400).json(responseFormatter(false, null, 'La note doit être entre 1 et 5'));
    }

    if (comment !== undefined && (comment.trim().length < 10 || comment.trim().length > 500)) {
      return res.status(400).json(responseFormatter(false, null, 'Le commentaire doit contenir entre 10 et 500 caractères'));
    }

    if (status !== undefined && !STATUS_VALUES.includes(status)) {
      return res.status(400).json(responseFormatter(false, null, 'Statut invalide pour le témoignage'));
    }

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json(responseFormatter(false, null, 'Témoignage non trouvé'));
    }

    await Testimonial.update(id, {
      rating: rating !== undefined ? rating : testimonial.rating,
      comment: comment !== undefined ? comment.trim() : testimonial.comment,
      status: status !== undefined ? status : testimonial.status
    });

    res.json(responseFormatter(true, null, 'Témoignage mis à jour avec succès'));
  } catch (err) {
    console.error('Error updating testimonial:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de la mise à jour du témoignage'));
  }
};

// Approve testimonial (admin)
exports.approve = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json(responseFormatter(false, null, 'Témoignage non trouvé'));
    }

    await Testimonial.approve(id);
    res.json(responseFormatter(true, null, 'Témoignage approuvé'));
  } catch (err) {
    console.error('Error approving testimonial:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de l\'approbation du témoignage'));
  }
};

// Reject testimonial (admin)
exports.reject = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json(responseFormatter(false, null, 'Témoignage non trouvé'));
    }

    await Testimonial.reject(id);
    res.json(responseFormatter(true, null, 'Témoignage rejeté'));
  } catch (err) {
    console.error('Error rejecting testimonial:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors du rejet du témoignage'));
  }
};

// Delete testimonial (admin)
exports.delete = async (req, res) => {
  try {
    const { id } = req.params;

    const testimonial = await Testimonial.findById(id);
    if (!testimonial) {
      return res.status(404).json(responseFormatter(false, null, 'Témoignage non trouvé'));
    }

    await Testimonial.delete(id);
    res.json(responseFormatter(true, null, 'Témoignage supprimé'));
  } catch (err) {
    console.error('Error deleting testimonial:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de la suppression du témoignage'));
  }
};

// Get testimonial stats
exports.getStats = async (req, res) => {
  try {
    const stats = await Testimonial.getAverageRating();
    res.json(responseFormatter(true, stats, 'Statistiques des témoignages récupérées'));
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json(responseFormatter(false, null, 'Erreur lors de la récupération des statistiques'));
  }
};
