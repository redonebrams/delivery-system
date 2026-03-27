import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login as loginService, getMe } from "../../services/authService";
import { AuthContext } from "../../context/AuthContext";
import { useLoading } from "../../context/LoadingContext";
import { useError } from "../../context/ErrorContext";
import { useValidation } from "../../utils/validation";
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
      console.log("📝 Tentative de connexion:", formData.email);

      // 🔥 ÉTAPE 1: Appeler le service de connexion
      const loginResult = await loginService(formData);
      console.log("✅ Réponse login:", loginResult);

      // Vérifier que le token a été reçu
      if (!loginResult?.token) {
        throw new Error("⚠️ Token non reçu du serveur");
      }

      // Token déjà stocké par loginService(), on peut juste récupérer les données
      const user = loginResult?.user;

      if (!user) {
        // Si le token a été reçu mais pas les données utilisateur du login
        // Essayer d'obtenir les données via getMe()
        console.log("📍 Token reçu, essai d'obtenir les données utilisateur via getMe()...");
        const meResult = await getMe();
        if (!meResult) {
          throw new Error("⚠️ Impossible de récupérer les données utilisateur");
        }
        login(meResult);
      } else {
        // Les données utilisateur sont déjà dans la réponse de login
        login(user);
      }

      handleSuccess("✅ Connexion réussie!");

      // 🔥 ÉTAPE 3: Redirection selon le rôle
      const userRole = user?.role || loginResult?.user?.role;
      console.log("👤 Rôle utilisateur:", userRole);

      if (userRole === "admin") {
        navigate("/admin/dashboard");
      } else if (userRole === "livreur") {
        navigate("/livreur/dashboard");
      } else if (userRole === "client") {
        navigate("/client/dashboard");
      } else {
        throw new Error("⚠️ Rôle utilisateur non reconnu: " + userRole);
      }

    } catch (err) {
      console.error("❌ Erreur connexion:", err);
      
      // Afficher un message d'erreur clair
      if (err.response?.status === 404) {
        handleApiError({ 
          response: { 
            data: { message: "🔍 Utilisateur non trouvé. Vérifiez votre email." }
          }
        });
      } else if (err.response?.status === 401) {
        handleApiError({ 
          response: { 
            data: { message: "🔐 Mot de passe incorrect." }
          }
        });
      } else if (err.response?.status === 403) {
        handleApiError({ 
          response: { 
            data: { message: "🚫 Compte désactivé. Contactez l'administrateur." }
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
    <div className="auth-container">
      <div className="card">
        <div className="card-header">
          <h1 className="title">Delivery System</h1>
          <h2 className="subtitle">Connexion</h2>
          <p className="text-body">Connectez-vous à votre compte</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-lg">
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFieldValue("email", e.target.value)
              }
              onBlur={() => setFieldTouched("email")}
              className={`form-input ${
                touched.email && errors.email ? "error" : ""
              }`}
              placeholder="Entrez votre email"
              disabled={isLoading("login")}
            />
            {touched.email && errors.email && (
              <span className="error-message">
                {errors.email}
              </span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Mot de passe</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) =>
                setFieldValue("password", e.target.value)
              }
              onBlur={() => setFieldTouched("password")}
              className={`form-input ${
                touched.password && errors.password
                  ? "error"
                  : ""
              }`}
              placeholder="Entrez votre mot de passe"
              disabled={isLoading("login")}
            />
            {touched.password && errors.password && (
              <span className="error-message">
                {errors.password}
              </span>
            )}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={!isValid || isLoading("login")}
          >
            {isLoading("login")
              ? "Chargement..."
              : "Se connecter"}
          </button>
        </form>

        <div className="mt-lg text-center">
          <p className="text-body">
            Pas encore de compte ?{" "}
            <Link to="/register" className="btn btn-outline">
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;