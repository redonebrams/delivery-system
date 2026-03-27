import React, { useState } from "react";
import { register } from "../../services/authService";
import { useValidation, validationRules } from "../../utils/validation";
import "./Auth.css";

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    

    
    if (!validateAll()) {

      return;
    }

    try {
      const { confirmPassword, ...registerData } = formData;

      
      const response = await register(registerData);

      
      alert("Inscription réussie !");
      // Redirect to login after successful registration
      window.location.href = "/login";
    } catch (error) {
      console.error('Registration error:', error);
      alert("Erreur lors de l'inscription: " + (error.response?.data?.message || error.message));
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Delivery System</h1>
          <h2>Inscription</h2>
          <p>Créer un nouveau compte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Nom</label>
            <input
              type="text"
              name="nom"
              value={formData.nom}
              onChange={handleChange}
              onBlur={() => handleBlur('nom')}
              className={`form-input ${touched.nom && errors.nom ? 'error' : ''}`}
              required
            />
            {touched.nom && errors.nom && (
              <span className="error-message">{errors.nom}</span>
            )}
          </div>

          <div className="form-group">
            <label>Prénom</label>
            <input
              type="text"
              name="prenom"
              value={formData.prenom}
              onChange={handleChange}
              onBlur={() => handleBlur('prenom')}
              className={`form-input ${touched.prenom && errors.prenom ? 'error' : ''}`}
              required
            />
            {touched.prenom && errors.prenom && (
              <span className="error-message">{errors.prenom}</span>
            )}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={() => handleBlur('email')}
              className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
              required
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label>Téléphone</label>
            <input
              type="text"
              name="telephone"
              value={formData.telephone}
              onChange={handleChange}
              onBlur={() => handleBlur('telephone')}
              className={`form-input ${touched.telephone && errors.telephone ? 'error' : ''}`}
              placeholder="06XXXXXXXX or 07XXXXXXXX"
              required
            />
            {touched.telephone && errors.telephone && (
              <span className="error-message">{errors.telephone}</span>
            )}
          </div>

          <div className="form-group">
            <label>Mot de passe</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onBlur={() => handleBlur('password')}
              className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
              placeholder="Min 8 caractères"
              required
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <div className="form-group">
            <label>Confirmer le mot de passe</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              onBlur={() => handleBlur('confirmPassword')}
              className={`form-input ${touched.confirmPassword && errors.confirmPassword ? 'error' : ''}`}
              placeholder="Confirmer le mot de passe"
              required
            />
            {touched.confirmPassword && errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={!isValid}
          >
            S'inscrire
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;