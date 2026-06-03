import React, { useState } from "react";
import { register } from "../../services/authService";
import { useValidation, validationRules } from "../../utils/validation";
import { FaUser, FaEnvelope, FaLock, FaPhone, FaCheck, FaTimes, FaTruck } from 'react-icons/fa';
import "./AuthModern.css";

const Register = () => {
  const {
    formData,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateAll,
    isValid
  } = useValidation(
    { 
      nom: '', 
      prenom: '', 
      email: '', 
      telephone: '', 
      password: '', 
      confirmPassword: '',
      role: 'client'
    },
    {
      nom: validationRules.nom,
      prenom: validationRules.prenom,
      email: validationRules.email,
      telephone: validationRules.telephone,
      password: validationRules.password,
      confirmPassword: validationRules.confirmPassword
    }
  );

  const handleChange = (e) => {
    setFieldValue(e.target.name, e.target.value);
  };

  const handleBlur = (field) => {
    setFieldTouched(field);
  };

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;
      
      const response = await register(registerData);
      
      setSuccessMessage("Inscription réussie !");
      setErrorMessage("");
      // Redirect to login after successful registration
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setErrorMessage("Erreur lors de l'inscription: " + (error.response?.data?.message || error.message));
      setSuccessMessage("");
    }
  };

  return (
    <div className="auth-modern-container">
      <div className="auth-modern-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FaTruck size={40} color="#ffffff" />
          </div>
          <h1 className="auth-title">Inscription</h1>
          <p className="auth-subtitle">Créer un nouveau compte</p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <div className="auth-message success">
            <FaCheck size={16} />
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="auth-message error">
            <FaTimes size={16} />
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-row">
            <div className="form-group-modern">
              <label className="form-label-modern">
                <FaUser size={16} />
                Nom
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  name="nom"
                  value={formData.nom}
                  onChange={handleChange}
                  onBlur={() => handleBlur('nom')}
                  className={`form-input-modern ${
                    touched.nom && errors.nom ? "error" : ""
                  }`}
                  placeholder="Votre nom"
                  required
                />
                <FaUser className="input-icon" />
              </div>
              {touched.nom && errors.nom && (
                <div className="error-message-modern">
                  <FaTimes size={12} />
                  {errors.nom}
                </div>
              )}
            </div>

            <div className="form-group-modern">
              <label className="form-label-modern">
                <FaUser size={16} />
                Prénom
              </label>
              <div className="position-relative">
                <input
                  type="text"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleChange}
                  onBlur={() => handleBlur('prenom')}
                  className={`form-input-modern ${
                    touched.prenom && errors.prenom ? "error" : ""
                  }`}
                  placeholder="Votre prénom"
                  required
                />
                <FaUser className="input-icon" />
              </div>
              {touched.prenom && errors.prenom && (
                <div className="error-message-modern">
                  <FaTimes size={12} />
                  {errors.prenom}
                </div>
              )}
            </div>
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">
              <FaEnvelope size={16} />
              Email
            </label>
            <div className="position-relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                className={`form-input-modern ${
                  touched.email && errors.email ? "error" : ""
                }`}
                placeholder="votre@email.com"
                required
              />
              <FaEnvelope className="input-icon" />
            </div>
            {touched.email && errors.email && (
              <div className="error-message-modern">
                <FaTimes size={12} />
                {errors.email}
              </div>
            )}
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">
              <FaPhone size={16} />
              Téléphone
            </label>
            <div className="position-relative">
              <input
                type="text"
                name="telephone"
                value={formData.telephone}
                onChange={handleChange}
                onBlur={() => handleBlur('telephone')}
                className={`form-input-modern ${
                  touched.telephone && errors.telephone ? "error" : ""
                }`}
                placeholder="06XXXXXXXX or 07XXXXXXXX"
                required
              />
              <FaPhone className="input-icon" />
            </div>
            {touched.telephone && errors.telephone && (
              <div className="error-message-modern">
                <FaTimes size={12} />
                {errors.telephone}
              </div>
            )}
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">
              <FaLock size={16} />
              Mot de passe
            </label>
            <div className="position-relative">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onBlur={() => handleBlur('password')}
                className={`form-input-modern ${
                  touched.password && errors.password ? "error" : ""
                }`}
                placeholder="Min 8 caractères"
                required
              />
              <FaLock className="input-icon" />
            </div>
            {touched.password && errors.password && (
              <div className="error-message-modern">
                <FaTimes size={12} />
                {errors.password}
              </div>
            )}
          </div>

          <div className="form-group-modern">
            <label className="form-label-modern">
              <FaLock size={16} />
              Confirmer le mot de passe
            </label>
            <div className="position-relative">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onBlur={() => handleBlur('confirmPassword')}
                className={`form-input-modern ${
                  touched.confirmPassword && errors.confirmPassword ? "error" : ""
                }`}
                placeholder="Confirmer le mot de passe"
                required
              />
              <FaLock className="input-icon" />
            </div>
            {touched.confirmPassword && errors.confirmPassword && (
              <div className="error-message-modern">
                <FaTimes size={12} />
                {errors.confirmPassword}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="btn-modern-primary"
            disabled={!isValid}
          >
            S'inscrire
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Déjà un compte ?{" "}
            <a href="/login" className="btn-modern-outline">
              Se connecter
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;