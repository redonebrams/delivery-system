import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import { useValidation } from "../../utils/validation";
import { LoadingSpinner } from "../../components/Common/Loading";
import "./Auth.css";

const Login = () => {
  const { login } = useContext(AuthContext);
  const { setLoading, isLoading } = useLoading();
  const { handleApiError, handleSuccess } = useError();
  const navigate = useNavigate();

  const {
    formData,
    errors,
    touched,
    setFieldValue,
    setFieldTouched,
    validateAll,
    isValid
  } = useValidation(
    { email: '', password: '' },
    { email: true, password: true }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateAll()) {
      return;
    }

    setLoading('login', true);
    
    try {
      const response = await loginService(formData);
      
      // Store token and user data
      localStorage.setItem('token', response.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      login(response.data.user);
      handleSuccess('Login successful!');
      
      // Redirect based on role
      const role = response.data.user?.role;
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "livreur") {
        navigate("/livreur/dashboard");
      } else {
        navigate("/client/dashboard");
      }
    } catch (err) {
      handleApiError(err);
    } finally {
      setLoading('login', false);
    }
  };

  const handleInputChange = (field, value) => {
    setFieldValue(field, value);
  };

  const handleInputBlur = (field) => {
    setFieldTouched(field);
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Delivery System</h1>
          <h2>Connexion</h2>
          <p>Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              onBlur={() => handleInputBlur('email')}
              className={`form-input ${touched.email && errors.email ? 'error' : ''}`}
              placeholder="Entrez votre email"
              disabled={isLoading('login')}
            />
            {touched.email && errors.email && (
              <span className="error-message">{errors.email}</span>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <input
              id="password"
              type="password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onBlur={() => handleInputBlur('password')}
              className={`form-input ${touched.password && errors.password ? 'error' : ''}`}
              placeholder="Entrez votre mot de passe"
              disabled={isLoading('login')}
            />
            {touched.password && errors.password && (
              <span className="error-message">{errors.password}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={!isValid || isLoading('login')}
          >
            {isLoading('login') ? <LoadingSpinner size="small" /> : 'Se connecter'}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Pas encore de compte? <Link to="/register" className="auth-link">S'inscrire</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

