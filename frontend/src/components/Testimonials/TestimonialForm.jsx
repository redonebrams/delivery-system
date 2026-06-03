import React, { useState } from 'react';
import { FaStar, FaCheckCircle, FaExclamationCircle, FaLightbulb } from 'react-icons/fa';
import { submitTestimonial } from '../../services/testimonialService';
import { useAuth } from '../../context/AuthContext';
import './TestimonialForm.css';

const TestimonialForm = ({ onSuccess }) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [warning, setWarning] = useState('');
  const [success, setSuccess] = useState('');
  const [hoverRating, setHoverRating] = useState(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setWarning('');
    setSuccess('');

    if (!rating) {
      setError('Veuillez sélectionner une note avant de continuer.');
      return;
    }

    if (!comment.trim()) {
      setError('Veuillez écrire un commentaire constructif.');
      return;
    }

    if (comment.trim().length < 10) {
      setError('Le commentaire doit contenir au moins 10 caractères.');
      return;
    }

    if (comment.trim().length > 500) {
      setError('Le commentaire ne doit pas dépasser 500 caractères.');
      return;
    }

    setLoading(true);
    try {
      const response = await submitTestimonial(rating, comment.trim());

      if (response.success) {
        setSuccess(response.message || 'Merci! Votre témoignage a été soumis avec succès.');
        setRating(0);
        setComment('');
        if (onSuccess) onSuccess();

        setTimeout(() => setSuccess(''), 5000);
      } else {
        const message = response.message || 'Erreur lors de la soumission du témoignage.';
        if (/déjà|déjà soumis|already|pending|en attente/i.test(message)) {
          setWarning(message);
        } else {
          setError(message);
        }
      }
    } catch (err) {
      const responseMessage = err.response?.data?.message || 'Erreur lors de la soumission du témoignage.';
      if (/déjà|déjà soumis|already|pending|en attente/i.test(responseMessage)) {
        setWarning(responseMessage);
      } else {
        setError(responseMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="testimonial-form-wrapper testimonial-form-guest">
        <div className="testimonial-form-login-prompt">
          <FaExclamationCircle size={28} />
          <h3>Connectez-vous pour laisser un avis</h3>
          <p>Votre expérience aide nos équipes à améliorer le service pour tous.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="testimonial-form-wrapper">
      <div className="testimonial-form-card">
        <div className="testimonial-form-hero">
          <div>
            <span className="section-pill">Témoignages</span>
            <h3 className="form-title">Partagez votre avis</h3>
            <p className="form-subtitle">
              Votre retour aide à rendre Veloxim Delivery plus fiable, plus rapide et plus proche de vos besoins.
            </p>
          </div>

          <div className="form-hero-info">
            <div className="hero-tip">
              <FaLightbulb />
              <p>Conseil : privilégiez un commentaire clair et précis pour aider d'autres utilisateurs.</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="testimonial-form">
          {(error || warning || success) && (
            <div
              className={`alert d-flex align-items-center gap-2 ${
                error ? 'alert-danger' : warning ? 'alert-warning' : 'alert-success'
              }`}
            >
              {error && <FaExclamationCircle />}
              {warning && <FaExclamationCircle />}
              {success && <FaCheckCircle />}
              <span>{error || warning || success}</span>
            </div>
          )}

          <div className="form-body">
            <div className="form-column">
              <div className="form-group">
                <label className="form-label">Score global</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      className={`star-button ${
                        (hoverRating || rating) >= star ? 'active' : ''
                      }`}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      aria-label={`${star} étoiles`}
                    >
                      <FaStar size={28} />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <small className="rating-feedback">
                    {rating === 5 && '🎉 Excellent choix — merci pour ce super retour !'}
                    {rating === 4 && '😊 Très bien, merci pour votre confiance.'}
                    {rating === 3 && '👍 Bon retour — nous visons l’excellence.'}
                    {rating === 2 && '😞 Nous sommes à l’écoute pour mieux vous servir.'}
                    {rating === 1 && '😢 Nous allons analyser votre expérience avec attention.'}
                  </small>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="comment" className="form-label">Votre message</label>
                <textarea
                  id="comment"
                  className="form-control"
                  rows="6"
                  placeholder="Décrivez votre expérience avec Veloxim Delivery (10-500 caractères)..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  disabled={loading}
                ></textarea>
                <div className="comment-counter">
                  {comment.length}/500 caractères
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-primary btn-lg btn-submit"
                disabled={loading}
              >
                {loading ? 'Envoi en cours...' : 'Envoyer mon témoignage'}
              </button>
            </div>

            <aside className="form-aside">
              <div className="aside-card">
                <h4>Comment rédiger un bon témoignage</h4>
                <ul>
                  <li>Restez concis et factuel</li>
                  <li>Mettez en avant vos points forts</li>
                  <li>Indiquez comment la livraison a été facilitée</li>
                </ul>
              </div>
              <div className="aside-card aside-trust">
                <span className="aside-pill">Vérifié</span>
                <p>
                  Tous les avis sont modérés avant publication pour garantir une information fiable et professionnelle.
                </p>
              </div>
            </aside>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TestimonialForm;
