import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import { createOrder } from "../../services/orderService";
import { calculatePrice } from "../../utils/priceCalculator";
import { validationRules, useValidation } from "../../utils/validation";
import ClientLayout from "../../components/Layout/ClientLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const NewOrder = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [price, setPrice] = useState(0);

  const initialForm = {
    type: "Restaurant",
    pickupName: "",
    pickupPhone: "",
    pickupAddress: "",
    deliveryName: "",
    deliveryPhone: "",
    deliveryAddress: "",
    distance: "",
    instructions: "",
    paymentMode: "Cash"
  };

  // Define rules for this form
  const rules = {
    type: { required: true },
    pickupName: validationRules.nom,
    pickupPhone: validationRules.telephone,
    pickupAddress: validationRules.address,
    deliveryName: validationRules.nom,
    deliveryPhone: validationRules.telephone,
    deliveryAddress: validationRules.address,
    distance: validationRules.distance
  };

  const {
    formData,
    errors,
    setFieldValue,
    setFieldTouched,
    validateAll,
    resetForm,
    isValid
  } = useValidation(initialForm, rules);

  const updatePrice = () => {
    const dist = parseFloat(formData.distance) || 0;
    const total = calculatePrice(dist, 15, 3); // base 15 MAD + 3/km
    setPrice(total);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    if (name === "distance") {
      updatePrice();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateAll() || !isValid) return;

    try {
      setIsSubmitting(true);
      
      // Mapper les champs du frontend vers le format attendu par le backend
      const orderData = {
        client_id: user?.id,
        livreur_id: null, // Sera assigné plus tard
        type_commande: formData.type,
        nom_retrait: formData.pickupName,
        telephone_retrait: formData.pickupPhone,
        adresse_retrait: formData.pickupAddress,
        nom_livraison: formData.deliveryName,
        telephone_livraison: formData.deliveryPhone,
        adresse_livraison: formData.deliveryAddress,
        distance_km: parseFloat(formData.distance) || 0,
        instructions_speciales: formData.instructions || null,
        prix_livraison: price,
        mode_paiement: formData.paymentMode,
        statut: "En attente"
      };
      

      await createOrder(orderData);
      
      // Toast de succès moderne
      const toast = document.createElement('div');
      toast.className = 'position-fixed top-0 end-0 p-3';
      toast.style.zIndex = '11';
      toast.innerHTML = `
        <div className="toast show" role="alert">
          <div className="toast-header bg-success text-white">
            <i className="bi bi-check-circle-fill me-2"></i>
            <strong className="me-auto">Succès</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
          </div>
          <div className="toast-body">
            Commande créée avec succès ! Redirection...
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      
      // Auto-suppression du toast après 2 secondes
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 2000);
      
      // Redirection plus rapide
      setTimeout(() => {
        resetForm();
        navigate("/client/dashboard");
      }, 1500);
    } catch (error) {
      console.error("Erreur création commande:", error);
      console.error("Détails de l'erreur:", error.response?.data);
      
      // Toast d'erreur détaillé
      const toast = document.createElement('div');
      toast.className = 'position-fixed top-0 end-0 p-3';
      toast.style.zIndex = '11';
      toast.innerHTML = `
        <div className="toast show" role="alert">
          <div className="toast-header bg-danger text-white">
            <i class="bi bi-exclamation-triangle-fill me-2"></i>
            <strong class="me-auto">Erreur</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
          </div>
          <div class="toast-body">
            <strong>Erreur lors de la création.</strong><br>
            ${error.response?.data?.message || error.message || 'Veuillez vérifier vos informations et réessayer.'}
          </div>
        </div>
      `;
      document.body.appendChild(toast);
      
      // Auto-suppression du toast d'erreur après 5 secondes
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 5000);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Annuler la création de commande ?")) {
      resetForm();
      navigate("/client/dashboard");
    }
  };

  const paymentOptions = [
    { value: "Cash", label: "💵 Espèces" },
    { value: "Card", label: "💳 Carte bancaire" },
    { value: "Mobile", label: "📱 Paiement mobile" }
  ];

  const typeOptions = [
    { value: "Restaurant", label: "🍔 Restaurant" },
    { value: "Pharmacie", label: "💊 Pharmacie" },
    { value: "Colis", label: "📦 Colis" },
    { value: "Courses", label: "🛒 Courses" }
  ];

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
          <i className="bi bi-plus-circle me-2"></i>Nouvelle Commande
        </h1>
        <p className="m-0 opacity-75">Créez votre livraison en quelques clics - Simple et sécurisé</p>
      </div>

      <div className="row g-4">
        {/* Formulaire PRINCIPAL */}
        <div className="col-lg-9">
          <form onSubmit={handleSubmit}>
            {/* Section 1: Type de livraison */}
            <div
              className="card rounded-4 mb-4 border"
              style={{
                borderColor: "#e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold" style={{ color: "#1e293b" }}>
                  <i
                    className="bi bi-box-seam me-2"
                    style={{ color: "#2563eb", fontSize: "1.25rem" }}
                  ></i>
                  Type de livraison
                </h5>
                <div className="row">
                  <div className="col-md-6">
                    <label
                      className="form-label fw-500"
                      style={{ color: "#1e293b", fontSize: "0.95rem" }}
                    >
                      <i className="bi bi-tag me-1" style={{ color: "#2563eb" }}></i>
                      Type de livraison *
                    </label>
                    <select
                      className={`form-select rounded-2 ${errors.type ? "is-invalid" : ""}`}
                      style={{
                        borderColor: "#e2e8f0",
                        padding: "0.75rem",
                        fontSize: "0.95rem",
                      }}
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      onBlur={() => setFieldTouched("type")}
                    >
                      {typeOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {errors.type && <div className="text-danger small mt-1">{errors.type}</div>}
                  </div>
                </div>
              </div>
            </div>

            {/* Section 2 & 3: Points de retrait et livraison */}
            <div className="row g-4 mb-4">
              {/* Point de retrait */}
              <div className="col-md-6">
                <div
                  className="card rounded-4 h-100 border"
                  style={{
                    borderColor: "#e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="card-body p-4">
                    <h6 className="mb-4 fw-bold" style={{ color: "#1e293b" }}>
                      <i
                        className="bi bi-geo-alt-fill me-2"
                        style={{ color: "#10b981", fontSize: "1.1rem" }}
                      ></i>
                      Point de retrait
                    </h6>

                    <div className="mb-3">
                      <label
                        className="form-label fw-500 small"
                        style={{ color: "#1e293b" }}
                      >
                        <i className="bi bi-person me-1" style={{ color: "#2563eb" }}></i>
                        Nom *
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-2 ${
                          errors.pickupName ? "is-invalid border-danger" : ""
                        }`}
                        style={{
                          borderColor: errors.pickupName ? "#ef4444" : "#e2e8f0",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                        }}
                        name="pickupName"
                        value={formData.pickupName}
                        onChange={handleInputChange}
                        onBlur={() => setFieldTouched("pickupName")}
                        placeholder="Nom du contact"
                      />
                      {errors.pickupName && (
                        <div className="text-danger small mt-1">{errors.pickupName}</div>
                      )}
                    </div>

                    <div className="mb-3">
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
                        className={`form-control rounded-2 ${
                          errors.pickupPhone ? "is-invalid border-danger" : ""
                        }`}
                        style={{
                          borderColor: errors.pickupPhone ? "#ef4444" : "#e2e8f0",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                        }}
                        name="pickupPhone"
                        value={formData.pickupPhone}
                        onChange={handleInputChange}
                        onBlur={() => setFieldTouched("pickupPhone")}
                        placeholder="06 XX XX XX XX"
                      />
                      {errors.pickupPhone && (
                        <div className="text-danger small mt-1">{errors.pickupPhone}</div>
                      )}
                    </div>

                    <div className="mb-0">
                      <label
                        className="form-label fw-500 small"
                        style={{ color: "#1e293b" }}
                      >
                        <i className="bi bi-house me-1" style={{ color: "#2563eb" }}></i>
                        Adresse *
                      </label>
                      <textarea
                        className={`form-control rounded-2 ${
                          errors.pickupAddress ? "is-invalid border-danger" : ""
                        }`}
                        style={{
                          borderColor: errors.pickupAddress ? "#ef4444" : "#e2e8f0",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                          minHeight: "80px",
                        }}
                        name="pickupAddress"
                        value={formData.pickupAddress}
                        onChange={handleInputChange}
                        onBlur={() => setFieldTouched("pickupAddress")}
                        rows={3}
                        placeholder="Adresse complète du retrait"
                      />
                      {errors.pickupAddress && (
                        <div className="text-danger small mt-1">{errors.pickupAddress}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Point de livraison */}
              <div className="col-md-6">
                <div
                  className="card rounded-4 h-100 border"
                  style={{
                    borderColor: "#e2e8f0",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  }}
                >
                  <div className="card-body p-4">
                    <h6 className="mb-4 fw-bold" style={{ color: "#1e293b" }}>
                      <i
                        className="bi bi-truck me-2"
                        style={{ color: "#2563eb", fontSize: "1.1rem" }}
                      ></i>
                      Point de livraison
                    </h6>

                    <div className="mb-3">
                      <label
                        className="form-label fw-500 small"
                        style={{ color: "#1e293b" }}
                      >
                        <i className="bi bi-person me-1" style={{ color: "#2563eb" }}></i>
                        Nom *
                      </label>
                      <input
                        type="text"
                        className={`form-control rounded-2 ${
                          errors.deliveryName ? "is-invalid border-danger" : ""
                        }`}
                        style={{
                          borderColor: errors.deliveryName ? "#ef4444" : "#e2e8f0",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                        }}
                        name="deliveryName"
                        value={formData.deliveryName}
                        onChange={handleInputChange}
                        onBlur={() => setFieldTouched("deliveryName")}
                        placeholder="Nom du destinataire"
                      />
                      {errors.deliveryName && (
                        <div className="text-danger small mt-1">{errors.deliveryName}</div>
                      )}
                    </div>

                    <div className="mb-3">
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
                        className={`form-control rounded-2 ${
                          errors.deliveryPhone ? "is-invalid border-danger" : ""
                        }`}
                        style={{
                          borderColor: errors.deliveryPhone ? "#ef4444" : "#e2e8f0",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                        }}
                        name="deliveryPhone"
                        value={formData.deliveryPhone}
                        onChange={handleInputChange}
                        onBlur={() => setFieldTouched("deliveryPhone")}
                        placeholder="06 XX XX XX XX"
                      />
                      {errors.deliveryPhone && (
                        <div className="text-danger small mt-1">{errors.deliveryPhone}</div>
                      )}
                    </div>

                    <div className="mb-0">
                      <label
                        className="form-label fw-500 small"
                        style={{ color: "#1e293b" }}
                      >
                        <i className="bi bi-house me-1" style={{ color: "#2563eb" }}></i>
                        Adresse *
                      </label>
                      <textarea
                        className={`form-control rounded-2 ${
                          errors.deliveryAddress ? "is-invalid border-danger" : ""
                        }`}
                        style={{
                          borderColor: errors.deliveryAddress ? "#ef4444" : "#e2e8f0",
                          padding: "0.75rem",
                          fontSize: "0.95rem",
                          minHeight: "80px",
                        }}
                        name="deliveryAddress"
                        value={formData.deliveryAddress}
                        onChange={handleInputChange}
                        onBlur={() => setFieldTouched("deliveryAddress")}
                        rows={3}
                        placeholder="Adresse de livraison"
                      />
                      {errors.deliveryAddress && (
                        <div className="text-danger small mt-1">{errors.deliveryAddress}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 4: Détails supplémentaires */}
            <div
              className="card rounded-4 mb-4 border"
              style={{
                borderColor: "#e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
              }}
            >
              <div className="card-body p-4">
                <h5 className="mb-4 fw-bold" style={{ color: "#1e293b" }}>
                  <i
                    className="bi bi-info-circle me-2"
                    style={{ color: "#0ea5e9", fontSize: "1.25rem" }}
                  ></i>
                  Détails supplémentaires
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <label
                      className="form-label fw-500 small"
                      style={{ color: "#1e293b" }}
                    >
                      <i
                        className="bi bi-rulers me-1"
                        style={{ color: "#2563eb" }}
                      ></i>
                      Distance estimée (km) *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      className={`form-control rounded-2 ${
                        errors.distance ? "is-invalid border-danger" : ""
                      }`}
                      style={{
                        borderColor: errors.distance ? "#ef4444" : "#e2e8f0",
                        padding: "0.75rem",
                        fontSize: "0.95rem",
                      }}
                      name="distance"
                      value={formData.distance}
                      onChange={handleInputChange}
                      onBlur={() => setFieldTouched("distance")}
                      placeholder="0.0"
                    />
                    {errors.distance && (
                      <div className="text-danger small mt-1">{errors.distance}</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label
                      className="form-label fw-500 small"
                      style={{ color: "#1e293b" }}
                    >
                      <i
                        className="bi bi-credit-card me-1"
                        style={{ color: "#2563eb" }}
                      ></i>
                      Mode de paiement
                    </label>
                    <select
                      className="form-select rounded-2"
                      style={{
                        borderColor: "#e2e8f0",
                        padding: "0.75rem",
                        fontSize: "0.95rem",
                      }}
                      name="paymentMode"
                      value={formData.paymentMode}
                      onChange={handleInputChange}
                    >
                      {paymentOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Instructions */}
                <div className="mt-4">
                  <label
                    className="form-label fw-500 small"
                    style={{ color: "#1e293b" }}
                  >
                    <i
                      className="bi bi-chat-text me-1"
                      style={{ color: "#2563eb" }}
                    ></i>
                    Instructions spéciales (optionnel)
                  </label>
                  <textarea
                    className="form-control rounded-2"
                    style={{
                      borderColor: "#e2e8f0",
                      padding: "0.75rem",
                      fontSize: "0.95rem",
                      minHeight: "100px",
                    }}
                    name="instructions"
                    value={formData.instructions}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Instructions pour le livreur..."
                  />
                </div>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="d-flex justify-content-end gap-3 mt-5">
              <button
                type="button"
                className="btn btn-lg rounded-2"
                style={{
                  background: "#f8fafc",
                  color: "#64748b",
                  border: "1px solid #e2e8f0",
                  fontWeight: 600,
                  padding: "0.75rem 1.75rem",
                  transition: "all 0.3s ease",
                }}
                onClick={handleCancel}
                disabled={isSubmitting}
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
              <button
                type="submit"
                className="btn btn-lg text-white rounded-2"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  border: "none",
                  fontWeight: 600,
                  padding: "0.75rem 2rem",
                  transition: "all 0.3s ease",
                  opacity: !isValid ? 0.6 : 1,
                  cursor: !isValid ? "not-allowed" : "pointer",
                }}
                disabled={!isValid || isSubmitting}
                onMouseEnter={(e) => {
                  if (isValid && !isSubmitting) {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 10px 25px rgba(37, 99, 235, 0.3)";
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                    Création en cours...
                  </>
                ) : (
                  <>
                    <i className="bi bi-check-circle me-2"></i>
                    Créer la commande
                  </>
                )}
              </button>
              </div>
            </form>
          </div>

          {/* SIDEBAR RÉSUMÉ */}
          <div className="col-lg-3">
            <div
              className="card rounded-4 border"
              style={{
                borderColor: "#e2e8f0",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                position: "sticky",
                top: "20px",
              }}
            >
              <div
                className="card-header text-white rounded-top-4"
                style={{
                  background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  border: "none",
                }}
              >
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-clipboard-check me-2"></i>
                  Résumé de votre commande
                </h5>
              </div>
              <div className="card-body p-4">
                {/* Type */}
                <div className="mb-4 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontWeight: 500, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Type
                  </small>
                  <p className="mb-0 fw-bold mt-1" style={{ color: "#1e293b", fontSize: "1rem" }}>
                    <i
                      className="bi bi-box-seam me-2"
                      style={{ color: "#2563eb" }}
                    ></i>
                    {formData.type}
                  </p>
                </div>

                {/* Distance */}
                <div className="mb-4 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontWeight: 500, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Distance
                  </small>
                  <p className="mb-0 fw-bold mt-1" style={{ color: "#1e293b", fontSize: "1rem" }}>
                    <i
                      className="bi bi-rulers me-2"
                      style={{ color: "#0ea5e9" }}
                    ></i>
                    {formData.distance || 0} km
                  </p>
                </div>

                {/* Mode de paiement */}
                <div className="mb-4 pb-3" style={{ borderBottom: "1px solid #e2e8f0" }}>
                  <small style={{ color: "#64748b", fontWeight: 500, textTransform: "uppercase", fontSize: "0.75rem" }}>
                    Mode de paiement
                  </small>
                  <p className="mb-0 fw-bold mt-1" style={{ color: "#1e293b", fontSize: "1rem" }}>
                    {formData.paymentMode === "Cash" && (
                      <>
                        <i className="bi bi-cash-stack me-2" style={{ color: "#10b981" }}></i>Espèces
                      </>
                    )}
                    {formData.paymentMode === "Card" && (
                      <>
                        <i className="bi bi-credit-card me-2" style={{ color: "#2563eb" }}></i>Carte
                      </>
                    )}
                    {formData.paymentMode === "Mobile" && (
                      <>
                        <i className="bi bi-phone me-2" style={{ color: "#0ea5e9" }}></i>Mobile
                      </>
                    )}
                  </p>
                </div>

                {/* Prix Estimé */}
                <div
                  className="rounded-3 p-4 mb-4 text-white text-center"
                  style={{
                    background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)",
                  }}
                >
                  <small style={{ opacity: 0.9, fontSize: "0.85rem", fontWeight: 500 }}>
                    Prix estimé
                  </small>
                  <h2 className="m-0 fw-bold mt-2" style={{ fontSize: "2rem" }}>
                    {price.toFixed(2)} <small style={{ fontSize: "1rem" }}>MAD</small>
                  </h2>
                </div>

                {/* Statut */}
                <div className="text-center mb-4">
                  <span
                    className="badge rounded-pill px-3 py-2"
                    style={{
                      background: "rgba(245, 158, 11, 0.15)",
                      color: "#f59e0b",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    <i className="bi bi-clock me-1"></i>
                    En attente de confirmation
                  </span>
                </div>

                {/* Progression */}
                {price > 0 && (
                  <div>
                    <div
                      className="progress rounded-pill"
                      style={{
                        height: "6px",
                        background: "#f1f5f9",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <div
                        className="progress-bar"
                        style={{
                          background: "linear-gradient(90deg, #10b981, #0ea5e9)",
                          width: "75%",
                        }}
                      ></div>
                    </div>
                    <small style={{ color: "#64748b", fontWeight: 500 }}>
                      Formulaire complété à 75%
                    </small>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
    </ClientLayout>
  );
};

export default NewOrder;
