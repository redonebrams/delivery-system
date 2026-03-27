import React, { useState, useContext, useEffect } from "react"; 
import { AuthContext } from "../../context/AuthContext";
import { getMe } from "../../services/authService";
import { updateClient } from "../../services/userService";
import ClientLayout from "../../components/Layout/ClientLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [profileData, setProfileData] = useState({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    avatar: null
  });

  const [avatarPreview, setAvatarPreview] = useState(null);

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getMe();
        setCurrentUser(data);
        setProfileData({
          prenom: data.prenom || "",
          nom: data.nom || "",
          email: data.email || "",
          telephone: data.telephone || "",
          avatar: data.avatar || null
        });
        setAvatarPreview(data.avatar || null);
      } catch (error) {
        setErrorMessage("Impossible de charger votre profil.");
      }
    };
    fetchProfile();
  }, []);

  const handleEditToggle = () => {
    setEditMode(prev => !prev);
    setErrorMessage("");
    setSuccessMessage("");
    setAvatarPreview(profileData.avatar || null);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileData(prev => ({ ...prev, avatar: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const validateProfile = () => {
    if (!profileData.prenom.trim()) return setErrorMessage("Le prénom est requis."), false;
    if (!profileData.nom.trim()) return setErrorMessage("Le nom est requis."), false;
    if (!profileData.telephone.trim()) return setErrorMessage("Le téléphone est requis."), false;
    if (!/^[0-9+\s-]+$/.test(profileData.telephone)) return setErrorMessage("Le format du téléphone est invalide."), false;
    setErrorMessage("");
    return true;
  };

  const handleSaveProfile = async () => {
    if (!validateProfile()) return;
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("prenom", profileData.prenom);
      formData.append("nom", profileData.nom);
      formData.append("telephone", profileData.telephone);
      if (profileData.avatar instanceof File) formData.append("avatar", profileData.avatar);

      const updatedUser = await updateClient(currentUser.id || currentUser._id, formData);
      setCurrentUser(updatedUser);
      setSuccessMessage("Profil mis à jour avec succès !");
      setEditMode(false);
      setAvatarPreview(updatedUser.avatar || null);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (error) {
      setErrorMessage(error.message || "Erreur lors de la mise à jour du profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vous déconnecter ?")) {
      logout();
      window.location.href = "/login";
    }
  };

  if (!currentUser) {
    return (
      <ClientLayout title="Chargement">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Chargement...</span>
          </div>
          <p className="mt-3 text-muted">Chargement de votre profil...</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout>
      {/* Header */}
      <div
        className="w-100 rounded-4 p-5 mb-5"
        style={{
          background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
          color: "white",
        }}
      >
        <h1 className="fw-bold mb-2">
          <i className="bi bi-person-circle me-2"></i>Mon Profil
        </h1>
        <p className="m-0 opacity-75">Gérez vos informations personnelles</p>
      </div>

      {/* Messages d'alerte */}
      {successMessage && (
        <div
          className="alert rounded-3 mb-4 border-0"
          style={{
            background: "rgba(16, 185, 129, 0.15)",
            color: "#10b981",
            padding: "1rem 1.25rem",
          }}
        >
          <i className="bi bi-check-circle me-2"></i>
          {successMessage}
        </div>
      )}
      {errorMessage && (
        <div
          className="alert rounded-3 mb-4 border-0"
          style={{
            background: "rgba(239, 68, 68, 0.15)",
            color: "#ef4444",
            padding: "1rem 1.25rem",
          }}
        >
          <i className="bi bi-exclamation-triangle me-2"></i>
          {errorMessage}
        </div>
      )}

      <div className="row g-4">
        {/* Carte Profil */}
        <div className="col-md-4 col-sm-12">
          <div
            className="card rounded-4 border text-center p-5"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            {avatarPreview ? (
              <img
                src={avatarPreview}
                alt="Avatar"
                className="rounded-circle mx-auto mb-4"
                style={{
                  width: "120px",
                  height: "120px",
                  objectFit: "cover",
                  border: "4px solid #e2e8f0",
                }}
              />
            ) : (
              <div
                className="rounded-circle d-flex align-items-center justify-content-center mx-auto mb-4"
                style={{
                  width: "120px",
                  height: "120px",
                  background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  color: "white",
                  fontSize: "3rem",
                }}
              >
                <i className="bi bi-person"></i>
              </div>
            )}
            <h5 className="fw-bold mb-2" style={{ color: "#1e293b", fontSize: "1.25rem" }}>
              {currentUser.prenom} {currentUser.nom}
            </h5>
            <p className="text-muted mb-3" style={{ fontSize: "0.9rem" }}>
              <i className="bi bi-envelope me-2" style={{ color: "#2563eb" }}></i>
              {currentUser.email}
            </p>
            <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
              <i className="bi bi-telephone me-2" style={{ color: "#2563eb" }}></i>
              {currentUser.telephone || "Non renseigné"}
            </p>
            <span
              className="badge rounded-pill px-3 py-2 mb-3 d-inline-block"
              style={{
                background: "rgba(14, 165, 233, 0.15)",
                color: "#0ea5e9",
                fontWeight: 600,
              }}
            >
              <i className="bi bi-shield-check me-1"></i>
              Client
            </span>
            <p
              style={{
                color: "#94a3b8",
                fontSize: "0.85rem",
                marginBottom: "1.5rem",
              }}
            >
              <i className="bi bi-calendar3 me-1"></i>
              Inscrit le{" "}
              {new Date(currentUser.created_at).toLocaleDateString("fr-FR")}
            </p>
            <div className="d-grid gap-2">
              <button
                className="btn btn-lg rounded-2 fw-bold"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  color: "white",
                  border: "none",
                  padding: "0.75rem",
                }}
                onClick={handleEditToggle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <i className="bi bi-pencil me-2"></i>
                {editMode ? "Annuler" : "Modifier le profil"}
              </button>
              <button
                className="btn btn-lg rounded-2 fw-bold"
                style={{
                  background: "#f8fafc",
                  color: "#ef4444",
                  border: "1px solid #fee2e2",
                  padding: "0.75rem",
                }}
                onClick={handleLogout}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "#fee2e2";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "#f8fafc";
                }}
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Déconnexion
              </button>
            </div>
          </div>
        </div>

        {/* Formulaire ou Informations */}
        <div className="col-md-8 col-sm-12">
          {editMode ? (
            <div
              className="card rounded-4 border p-5"
              style={{
                borderColor: "#e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h5
                className="mb-4 fw-bold"
                style={{ color: "#1e293b", fontSize: "1.25rem" }}
              >
                <i
                  className="bi bi-pencil-square me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                Modifier mes informations
              </h5>

              {/* Avatar */}
              <div className="mb-4 text-center">
                {avatarPreview && (
                  <img
                    src={avatarPreview}
                    alt="Avatar"
                    className="rounded-circle mb-3"
                    style={{
                      width: "100px",
                      height: "100px",
                      objectFit: "cover",
                      border: "4px solid #e2e8f0",
                    }}
                  />
                )}
                <label
                  className="form-label fw-500"
                  style={{ color: "#1e293b" }}
                >
                  <i
                    className="bi bi-image me-1"
                    style={{ color: "#2563eb" }}
                  ></i>
                  Photo de profil
                </label>
                <input
                  type="file"
                  onChange={handleAvatarChange}
                  accept="image/*"
                  className="form-control rounded-2"
                  style={{
                    borderColor: "#e2e8f0",
                    padding: "0.75rem",
                  }}
                />
              </div>

              <div className="row g-3 mb-4">
                <div className="col-md-6">
                  <label
                    className="form-label fw-500 small"
                    style={{ color: "#1e293b" }}
                  >
                    <i className="bi bi-person me-1" style={{ color: "#2563eb" }}></i>
                    Prénom *
                  </label>
                  <input
                    type="text"
                    name="prenom"
                    value={profileData.prenom}
                    onChange={handleProfileChange}
                    className="form-control rounded-2"
                    style={{
                      borderColor: "#e2e8f0",
                      padding: "0.75rem",
                    }}
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="col-md-6">
                  <label
                    className="form-label fw-500 small"
                    style={{ color: "#1e293b" }}
                  >
                    <i className="bi bi-person me-1" style={{ color: "#2563eb" }}></i>
                    Nom *
                  </label>
                  <input
                    type="text"
                    name="nom"
                    value={profileData.nom}
                    onChange={handleProfileChange}
                    className="form-control rounded-2"
                    style={{
                      borderColor: "#e2e8f0",
                      padding: "0.75rem",
                    }}
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label
                  className="form-label fw-500 small"
                  style={{ color: "#1e293b" }}
                >
                  <i
                    className="bi bi-telephone me-1"
                    style={{ color: "#2563eb" }}
                  ></i>
                  Téléphone *
                </label>
                <input
                  type="tel"
                  name="telephone"
                  value={profileData.telephone}
                  onChange={handleProfileChange}
                  className="form-control rounded-2"
                  style={{
                    borderColor: "#e2e8f0",
                    padding: "0.75rem",
                  }}
                  placeholder="06 XX XX XX XX"
                />
              </div>

              <div className="mb-4">
                <label
                  className="form-label fw-500 small"
                  style={{ color: "#1e293b" }}
                >
                  <i
                    className="bi bi-envelope me-1"
                    style={{ color: "#2563eb" }}
                  ></i>
                  Email (non modifiable)
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  className="form-control rounded-2"
                  style={{
                    borderColor: "#e2e8f0",
                    padding: "0.75rem",
                    background: "#f8fafc",
                  }}
                  disabled
                />
              </div>

              <div className="d-flex gap-2">
                <button
                  className="btn btn-lg flex-fill rounded-2"
                  onClick={handleSaveProfile}
                  disabled={loading}
                  style={{
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    color: "white",
                    border: "none",
                    fontWeight: 600,
                    opacity: loading ? 0.6 : 1,
                    cursor: loading ? "not-allowed" : "pointer",
                  }}
                >
                  <i className="bi bi-check-circle me-2"></i>
                  {loading ? "Sauvegarde..." : "Enregistrer"}
                </button>
                <button
                  className="btn btn-lg flex-fill rounded-2"
                  onClick={handleEditToggle}
                  style={{
                    background: "#f8fafc",
                    color: "#64748b",
                    border: "1px solid #e2e8f0",
                    fontWeight: 600,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#e2e8f0";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "#f8fafc";
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>
                  Annuler
                </button>
              </div>
            </div>
          ) : (
            <div
              className="card rounded-4 border p-5"
              style={{
                borderColor: "#e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <h5
                className="mb-4 fw-bold"
                style={{ color: "#1e293b", fontSize: "1.25rem" }}
              >
                <i
                  className="bi bi-info-circle me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                Mes informations personnelles
              </h5>

              <div className="row g-4">
                <div className="col-md-6">
                  <div
                    className="p-3 rounded-2"
                    style={{ background: "#f8fafc", borderLeft: "4px solid #2563eb" }}
                  >
                    <small
                      style={{
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                      }}
                    >
                      Prénom
                    </small>
                    <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                      <i className="bi bi-person me-2" style={{ color: "#2563eb" }}></i>
                      {currentUser.prenom}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="p-3 rounded-2"
                    style={{ background: "#f8fafc", borderLeft: "4px solid #2563eb" }}
                  >
                    <small
                      style={{
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                      }}
                    >
                      Nom
                    </small>
                    <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                      <i className="bi bi-person me-2" style={{ color: "#2563eb" }}></i>
                      {currentUser.nom}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="p-3 rounded-2"
                    style={{ background: "#f8fafc", borderLeft: "4px solid #0ea5e9" }}
                  >
                    <small
                      style={{
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                      }}
                    >
                      Email
                    </small>
                    <p
                      className="m-0 mt-1 fw-bold"
                      style={{ color: "#1e293b", wordBreak: "break-all" }}
                    >
                      <i className="bi bi-envelope me-2" style={{ color: "#0ea5e9" }}></i>
                      {currentUser.email}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div
                    className="p-3 rounded-2"
                    style={{ background: "#f8fafc", borderLeft: "4px solid #10b981" }}
                  >
                    <small
                      style={{
                        color: "#64748b",
                        fontWeight: 500,
                        textTransform: "uppercase",
                        fontSize: "0.75rem",
                      }}
                    >
                      Téléphone
                    </small>
                    <p className="m-0 mt-1 fw-bold" style={{ color: "#1e293b" }}>
                      <i className="bi bi-telephone me-2" style={{ color: "#10b981" }}></i>
                      {currentUser.telephone || "Non renseigné"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ClientLayout>
  );
};

export default Profile;