import React, { useState, useEffect } from "react";
import { getTarifs, updateTarifs } from "../../services/orderService";
import { useError } from "../../context/ErrorContext";
import { useLoading } from "../../context/LoadingContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Settings = () => {
  const { handleApiError, handleSuccess } = useError();
  const { setLoading, isLoading } = useLoading();

  const [tarifs, setTarifs] = useState({});
  const [formData, setFormData] = useState({
    prix_base: 15,
    tarif_km: 3,
    frais_min: 0,
  });

  // Fetch tarifs on mount
  useEffect(() => {
    const fetchTarifs = async () => {
      try {
        setLoading("tarifs", true);
        const data = await getTarifs();
        setTarifs(data || {});
        setFormData({
          prix_base: data?.prix_base ? parseFloat(data.prix_base) : 15,
          tarif_km: data?.tarif_km ? parseFloat(data.tarif_km) : 3,
          frais_min: data?.frais_min ? parseFloat(data.frais_min) : 0,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des tarifs :", error);
        handleApiError(error);
      } finally {
        setLoading("tarifs", false);
      }
    };
    fetchTarifs();
  }, []);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value) || 0,
    }));
  };

  // Handle form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading("submit", true);
      await updateTarifs(formData);
      handleSuccess("Tarifs mis à jour avec succès !");
      setTarifs(formData);
    } catch (error) {
      console.error("Erreur lors de la mise à jour :", error);
      handleApiError(error);
    } finally {
      setLoading("submit", false);
    }
  };

  return (
    <AdminLayout title="Paramètres">
      <div className="row g-4">
        {/* Tarifs Card */}
        <div className="col-md-6">
          <div
            className="card rounded-4 border"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
            }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                <i
                  className="bi bi-tag me-2"
                  style={{ color: "#2563eb" }}
                ></i>
                Tarifs de Livraison
              </h5>

              {isLoading("tarifs") ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status"></div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  {/* Prix Base */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-600 mb-2"
                      style={{ color: "#1e293b" }}
                    >
                      Prix de Base (MAD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control rounded-2"
                      name="prix_base"
                      value={formData.prix_base}
                      onChange={handleChange}
                      disabled={isLoading("submit")}
                      style={{ borderColor: "#e2e8f0", padding: "0.75rem" }}
                    />
                    <small style={{ color: "#64748b" }}>
                      Tarif de base appliqué à chaque livraison
                    </small>
                  </div>

                  {/* Tarif par KM */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-600 mb-2"
                      style={{ color: "#1e293b" }}
                    >
                      Tarif par Kilomètre (MAD/km)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control rounded-2"
                      name="tarif_km"
                      value={formData.tarif_km}
                      onChange={handleChange}
                      disabled={isLoading("submit")}
                      style={{ borderColor: "#e2e8f0", padding: "0.75rem" }}
                    />
                    <small style={{ color: "#64748b" }}>
                      Coût supplémentaire par km parcouru
                    </small>
                  </div>

                  {/* Frais Min */}
                  <div className="mb-4">
                    <label
                      className="form-label fw-600 mb-2"
                      style={{ color: "#1e293b" }}
                    >
                      Frais Minimaux (MAD)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      className="form-control rounded-2"
                      name="frais_min"
                      value={formData.frais_min || 0}
                      onChange={handleChange}
                      disabled={isLoading("submit")}
                      style={{ borderColor: "#e2e8f0", padding: "0.75rem" }}
                    />
                    <small style={{ color: "#64748b" }}>
                      Frais minimum garantis par livraison
                    </small>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isLoading("submit")}
                    className="w-100 fw-600"
                    style={{
                      background: isLoading("submit")
                        ? "#cbd5e1"
                        : "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                      color: "white",
                      border: "none",
                      padding: "0.75rem",
                      borderRadius: "0.5rem",
                      cursor: isLoading("submit") ? "not-allowed" : "pointer",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      if (!isLoading("submit")) {
                        e.currentTarget.style.transform = "translateY(-2px)";
                        e.currentTarget.style.boxShadow =
                          "0 4px 12px rgba(37, 99, 235, 0.3)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <i className="bi bi-check-circle me-2"></i>
                    {isLoading("submit")
                      ? "Mise à jour..."
                      : "Enregistrer les modifications"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Info Card */}
        <div className="col-md-6">
          <div
            className="card rounded-4 border"
            style={{
              borderColor: "#e2e8f0",
              boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              background: "linear-gradient(135deg, #f0f9ff 0%, #f5fbff 100%)",
            }}
          >
            <div className="card-body p-4">
              <h5 className="fw-bold mb-3" style={{ color: "#0284c7" }}>
                <i className="bi bi-info-circle me-2"></i>À propos des Tarifs
              </h5>
              <ul style={{ color: "#1e293b", fontSize: "0.95rem", lineHeight: "1.8" }}>
                <li className="mb-2">
                  <strong>Prix de Base :</strong> Coût fixe pour toute livraison
                </li>
                <li className="mb-2">
                  <strong>Tarif/km :</strong> Coût supplémentaire basé sur la distance
                </li>
                <li className="mb-2">
                  <strong>Frais Min :</strong> Montant minimum garanti
                </li>
              </ul>
              <div
                style={{
                  marginTop: "1.5rem",
                  padding: "1rem",
                  background: "white",
                  borderRadius: "0.5rem",
                  borderLeft: "4px solid #2563eb",
                }}
              >
                <small style={{ color: "#64748b" }}>
                  <strong>Formule de calcul :</strong>
                  <br />
                  Max(Prix Base + Tarif/km × Distance, Frais Min)
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Settings;