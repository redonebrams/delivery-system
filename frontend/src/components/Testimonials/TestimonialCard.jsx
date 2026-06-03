import React from 'react';
import { FaStar } from 'react-icons/fa';
import './TestimonialCard.css';

const TestimonialCard = ({ testimonial }) => {
  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <FaStar
        key={i}
        className={`star ${i < rating ? 'filled' : 'empty'}`}
        size={16}
      />
    ));
  };

  const getInitials = (nom, prenom) => {
    return `${nom?.charAt(0) || ''}${prenom?.charAt(0) || ''}`.toUpperCase();
  };

  const avatarUrl = testimonial.photo
    ? `${process.env.REACT_APP_API_URL}/${testimonial.photo}`
    : null;

  return (
    <article className="testimonial-card p-4">
      <div className="testimonial-header d-flex align-items-start gap-3">
        <div className="testimonial-avatar">
          {avatarUrl ? (
            <img src={avatarUrl} alt={`${testimonial.nom} ${testimonial.prenom}`} />
          ) : (
            <div className="avatar-initials">
              {getInitials(testimonial.nom, testimonial.prenom)}
            </div>
          )}
        </div>
        <div className="testimonial-meta flex-grow-1">
          <h5 className="testimonial-name mb-1">
            {testimonial.nom} {testimonial.prenom}
          </h5>
          <div className="testimonial-rating">
            {renderStars(testimonial.rating)}
            <span className="rating-value ms-2">({testimonial.rating}/5)</span>
          </div>
        </div>
      </div>

      <div className="testimonial-content mt-3">
        <p className="testimonial-quote">{testimonial.comment}</p>
      </div>

      <div className="testimonial-date mt-3">
        <small>{new Date(testimonial.created_at).toLocaleDateString('fr-FR')}</small>
      </div>
    </article>
  );
};

export default TestimonialCard;
