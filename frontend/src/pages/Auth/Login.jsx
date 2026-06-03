import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService, getMe } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import { useValidation } from "../../utils/validation";
import { FaUser, FaLock, FaEnvelope, FaTruck, FaCheck, FaTimes, FaBan } from 'react-icons/fa';
import "./AuthModern.css";

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
    { email: "", password: "" },
    {
      email: {
        required: true,
        validate: (val) =>
          /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val),
        message: "Email invalide"
      },
      password: {
        required: true,
        message: "Mot de passe requis"
      }
    }
  );

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateAll()) return;

    setLoading("login", true);

    try {
      console.log("?? Tentative de connexion:", formData.email);

      // ?? ÉTAPE 1: Appeler le service de connexion
      const loginResult = await loginService(formData);
      console.log("?? Réponse login:", loginResult);

      // Vérifier que le token a été reçu
      if (!loginResult?.token) {
        throw new Error("?? Token non reçu du serveur");
      }

      // Token déjà stocké par loginService(), on peut juste récupérer les données
      const user = loginResult?.user;

      if (!user) {
        // Si le token a été reçu mais pas les données utilisateur du login
        // Essayer d'obtenir les données via getMe()
        console.log("?? Token reçu, essai d'obtenir les données utilisateur via getMe()...");
        const meResult = await getMe();
        if (!meResult) {
          throw new Error("?? Impossible de récupérer les données utilisateur");
        }
        login(meResult);
      } else {
        // Les données utilisateur sont déjà dans la réponse de login
        login(user);
      }

      handleSuccess(<><FaCheck className="me-2" />Connexion réussie!</>);

      // ?? ÉTAPE 3: Redirection selon le rôle
      const userRole = user?.role || loginResult?.user?.role;
      console.log("?? Rôle utilisateur:", userRole);

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "livreur") {
        navigate("/livreur/dashboard");
      } else if (userRole === "client") {
        navigate("/client/dashboard");
      } else {
        throw new Error("?? Rôle utilisateur non reconnu: " + userRole);
      }

    } catch (err) {
      console.error("?? Erreur connexion:", err);
      
      // Afficher un message d'erreur clair
      if (err.response?.status === 404) {
        handleApiError({ 
          response: { 
            data: { message: <><FaSearch className="me-2" />Utilisateur non trouvé. Vérifiez votre email.</> }
          }
        });
      } else if (err.response?.status === 401) {
        handleApiError({ 
          response: { 
            data: { message: <><FaLock className="me-2" />Mot de passe incorrect.</> }
          }
        });
      } else if (err.response?.status === 403) {
        handleApiError({ 
          response: { 
            data: { message: <><FaBan className="me-2" />Compte désactivé. Contactez l'administrateur.</> }
          }
        });
      } else {
        handleApiError(err);
      }
    } finally {
      setLoading("login", false);
    }
  };

  return (
    <div className="auth-modern-container">
      <div className="auth-modern-card">
        <div className="auth-header">
          <div className="auth-logo">
            <FaTruck size={40} color="#ffffff" />
          </div>
          <h1 className="auth-title">Connexion</h1>
          <p className="auth-subtitle">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group-modern">
            <label className="form-label-modern">
              <FaEnvelope size={16} />
              Email
            </label>
            <div className="position-relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFieldValue("email", e.target.value)
                }
                onBlur={() => setFieldTouched("email")}
                className={`form-input-modern ${
                  touched.email && errors.email ? "error" : ""
                }`}
                placeholder="Entrez votre email"
                disabled={isLoading("login")}
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
              <FaLock size={16} />
              Mot de passe
            </label>
            <div className="position-relative">
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFieldValue("password", e.target.value)
                }
                onBlur={() => setFieldTouched("password")}
                className={`form-input-modern ${
                  touched.password && errors.password ? "error" : ""
                }`}
                placeholder="Entrez votre mot de passe"
                disabled={isLoading("login")}
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

          <button
            type="submit"
            className={`btn-modern-primary ${isLoading("login") ? "btn-loading" : ""}`}
            disabled={!isValid || isLoading("login")}
          >
            {isLoading("login") ? "" : "Se connecter"}
          </button>
        </form>

        <div className="auth-footer">
          <p className="auth-footer-text">
            Pas encore de compte ?{" "}
            <Link to="/register" className="btn-modern-outline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;