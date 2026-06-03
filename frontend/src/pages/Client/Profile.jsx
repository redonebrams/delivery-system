import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ClientLayout from "../../components/Layout/ClientLayout";
import { getMe } from "../../services/authService";
import { updateClient } from "../../services/userService";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Profile = () => {
  const { logout } = useContext(AuthContext);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ prenom: "", nom: "", email: "", telephone: "" });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getMe();
        setUser(data);
        setFormData({
          prenom: data.prenom || "",
          nom: data.nom || "",
          email: data.email || "",
          telephone: data.telephone || "",
        });
        setAvatarPreview(data.photo || null);
      } catch (error) {
        setMessage({ type: "danger", text: "Impossible de charger votre profil." });
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const updateField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setMessage(null);
  };

  const handleSave = async () => {
    if (!formData.prenom.trim() || !formData.nom.trim() || !formData.telephone.trim()) {
      setMessage({ type: "danger", text: "Le prenom, le nom et le telephone sont requis." });
      return;
    }

    try {
      setSaving(true);
      const payload = {
        prenom: formData.prenom,
        nom: formData.nom,
        telephone: formData.telephone,
      };

      const updated = await updateClient(user.id || user._id, payload);
      const nextUser = updated?.data || updated;
      setUser(nextUser);
      setFormData({
        prenom: nextUser.prenom || "",
        nom: nextUser.nom || "",
        email: nextUser.email || "",
        telephone: nextUser.telephone || "",
      });
      setEditing(false);
      setMessage({ type: "success", text: "Profil mis a jour avec succes." });
    } catch (error) {
      setMessage({ type: "danger", text: error.response?.data?.message || error.message || "Erreur lors de la mise a jour du profil." });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Etes-vous sur de vouloir vous deconnecter ?")) {
      logout();
      window.location.href = "/login";
    }
  };

  if (loading) {
    return (
      <ClientLayout title="Mon Profil" subtitle="Chargement de vos informations personnelles.">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <p className="text-muted mt-3">Chargement de votre profil...</p>
        </div>
      </ClientLayout>
    );
  }

  return (
    <ClientLayout title="Mon Profil" subtitle="Gerez vos informations personnelles et vos preferences de compte.">
      {message && (
        <div className={`alert alert-${message.type} d-flex align-items-center`} role="alert">
          <i className={`bi bi-${message.type === "success" ? "check-circle" : "exclamation-triangle"} me-2`}></i>
          {message.text}
        </div>
      )}

      <div className="row g-4">
        <div className="col-lg-4">
          <div className="client-card p-4 text-center h-100">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Avatar" className="rounded-circle mb-4" style={{ width: 120, height: 120, objectFit: "cover", border: "4px solid #e2e8f0" }} />
            ) : (
              <span className="rounded-circle d-inline-flex align-items-center justify-content-center mb-4 client-gradient-btn" style={{ width: 120, height: 120 }}>
                <i className="bi bi-person display-5"></i>
              </span>
            )}

            <h5 className="fw-bold mb-1" style={{ color: "#1e293b" }}>{user?.prenom} {user?.nom}</h5>
            <p className="text-muted mb-3">{user?.email}</p>
            <span className="badge mb-4" style={{ background: "rgba(14, 165, 233, 0.15)", color: "#0ea5e9" }}>
              <i className="bi bi-shield-check me-1"></i>
              Client
            </span>

            <div className="d-grid gap-2">
              <button className="btn client-gradient-btn" type="button" onClick={() => { setEditing((value) => !value); setMessage(null); }}>
                <i className={`bi bi-${editing ? "x-circle" : "pencil"}`}></i>
                {editing ? "Annuler" : "Modifier le profil"}
              </button>
              <button className="btn btn-outline-danger" type="button" onClick={handleLogout}>
                <i className="bi bi-box-arrow-right"></i>
                Deconnexion
              </button>
            </div>
          </div>
        </div>

        <div className="col-lg-8">
          <div className="client-card p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h5 className="fw-bold mb-0" style={{ color: "#1e293b" }}>
                <i className="bi bi-info-circle me-2" style={{ color: "#2563eb" }}></i>
                Informations personnelles
              </h5>
              {!editing && (
                <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => setEditing(true)}>
                  <i className="bi bi-pencil"></i>
                </button>
              )}
            </div>

            {editing ? (
              <>
                <div className="row g-3">
                  <ProfileField label="Prenom" icon="bi-person" value={formData.prenom} onChange={(value) => updateField("prenom", value)} />
                  <ProfileField label="Nom" icon="bi-person" value={formData.nom} onChange={(value) => updateField("nom", value)} />
                  <ProfileField label="Telephone" icon="bi-telephone" value={formData.telephone} onChange={(value) => updateField("telephone", value)} />
                  <div className="col-md-6">
                    <label className="form-label">
                      <i className="bi bi-envelope me-1" style={{ color: "#2563eb" }}></i>
                      Email
                    </label>
                    <input className="form-control" value={formData.email} disabled />
                  </div>
                </div>

                <div className="d-flex flex-wrap justify-content-end gap-2 mt-4">
                  <button className="btn btn-outline-secondary" type="button" onClick={() => setEditing(false)} disabled={saving}>
                    <i className="bi bi-x-circle"></i>
                    Annuler
                  </button>
                  <button className="btn btn-success" type="button" onClick={handleSave} disabled={saving}>
                    {saving ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-check-circle"></i>}
                    Enregistrer
                  </button>
                </div>
              </>
            ) : (
              <div className="row g-4">
                <InfoCard label="Prenom" value={user?.prenom || "-"} icon="bi-person" color="#2563eb" />
                <InfoCard label="Nom" value={user?.nom || "-"} icon="bi-person" color="#2563eb" />
                <InfoCard label="Email" value={user?.email || "-"} icon="bi-envelope" color="#0ea5e9" />
                <InfoCard label="Telephone" value={user?.telephone || "Non renseigne"} icon="bi-telephone" color="#10b981" />
              </div>
            )}
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

const ProfileField = ({ label, icon, value, onChange }) => (
  <div className="col-md-6">
    <label className="form-label">
      <i className={`bi ${icon} me-1`} style={{ color: "#2563eb" }}></i>
      {label} *
    </label>
    <input className="form-control" value={value} onChange={(event) => onChange(event.target.value)} />
  </div>
);

const InfoCard = ({ label, value, icon, color }) => (
  <div className="col-md-6">
    <div className="p-3 rounded-2 h-100" style={{ background: "#f8fafc", borderLeft: `4px solid ${color}` }}>
      <small className="text-muted text-uppercase fw-semibold">{label}</small>
      <p className="fw-bold mb-0 mt-1" style={{ color: "#1e293b", wordBreak: "break-word" }}>
        <i className={`bi ${icon} me-2`} style={{ color }}></i>
        {value}
      </p>
    </div>
  </div>
);

export default Profile;
