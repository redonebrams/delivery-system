import React, { useEffect, useState } from 'react';
import { getApprovedTestimonials, getTestimonialStats } from '../../services/testimonialService';
import TestimonialCard from './TestimonialCard';
import { FaSpinner, FaExclamationTriangle, FaStar } from 'react-icons/fa';
import './TestimonialsList.css';

const TestimonialsList = ({ refreshTrigger }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadTestimonials();
  }, [refreshTrigger]);

  const loadTestimonials = async () => {
    try {
      setLoading(true);
      setError('');
      const [testimonialsData, statsData] = await Promise.all([
        getApprovedTestimonials(),
        getTestimonialStats()
      ]);

      setTestimonials(testimonialsData.testimonials || []);
      setStats(statsData);
    } catch (err) {
      console.error('Error loading testimonials:', err);
      setError('Erreur lors du chargement des témoignages');
    } finally {
      setLoading(false);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`star ${i < Math.round(rating || 0) ? 'filled' : 'empty'}`}
        size={18}
      />
    ));
  };

  if (loading) {
    return (
      <div className="testimonials-loading">
        <FaSpinner className="spinner" size={32} />
        <p>Chargement des témoignages...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="testimonials-error">
        <FaExclamationTriangle size={24} />
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="testimonials-container">
      <div className="testimonials-header">
        <div>
          <span className="section-pill">Témoignages clients</span>
          <h2>Ce que disent nos utilisateurs</h2>
          <p className="section-copy">
            Découvrez des retours authentiques d'entreprises et de particuliers qui font confiance à Veloxim Delivery pour leurs livraisons.
          </p>
        </div>
        {stats && (
          <div className="testimonials-highlights">
            <div className="highlight-chart">
              <div className="highlight-score">{typeof stats.averageRating === 'number' ? stats.averageRating.toFixed(1) : 'N/A'}</div>
              <div className="highlight-stars">{renderStars(stats.averageRating)}</div>
              <p className="highlight-label">Note moyenne</p>
            </div>
            <div className="highlight-meta">
              <div className="highlight-pill">+{stats.totalCount || 0} avis approuvés</div>
              <div className="highlight-pill secondary">Publié après validation humaine</div>
            </div>
          </div>
        )}
      </div>

      {stats && stats.totalCount > 0 && (
        <div className="testimonials-stats">
          <div className="stats-card">
            <div className="stats-rating-display">
              {renderStars(stats.averageRating)}
              <span className="rating-number">
                {typeof stats.averageRating === 'number'
                  ? stats.averageRating.toFixed(1)
                  : 'N/A'}
              </span>
            </div>
            <p className="stats-text">
              Basé sur {stats.totalCount} avis clients examinés par notre équipe.
            </p>
          </div>
        </div>
      )}

      {testimonials.length > 0 ? (
        <div className="testimonials-grid">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      ) : (
        <div className="testimonials-empty">
          <p>Pas encore de témoignages. Soyez le premier à partager votre expérience!</p>
        </div>
      )}
    </div>
  );
};

export default TestimonialsList;
