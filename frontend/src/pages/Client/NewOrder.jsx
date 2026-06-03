import React, { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import ClientLayout from "../../components/Layout/ClientLayout";
import { createOrder } from "../../services/orderService";
import { calculatePrice } from "../../utils/priceCalculator";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

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
  paymentMode: "Cash",
};

const NewOrder = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const price = useMemo(() => calculatePrice(parseFloat(formData.distance) || 0, 15, 3), [formData.distance]);

  const setField = (name, value) => {
    setFormData((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};
    const required = [
      ["pickupName", "Le nom du retrait est requis."],
      ["pickupPhone", "Le telephone du retrait est requis."],
      ["pickupAddress", "L'adresse de retrait est requise."],
      ["deliveryName", "Le nom du destinataire est requis."],
      ["deliveryPhone", "Le telephone de livraison est requis."],
      ["deliveryAddress", "L'adresse de livraison est requise."],
      ["distance", "La distance est requise."],
    ];

    required.forEach(([field, error]) => {
      if (!String(formData[field] || "").trim()) nextErrors[field] = error;
    });

    if (formData.distance && Number(formData.distance) <= 0) {
      nextErrors.distance = "La distance doit etre superieure a 0.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    try {
      setSubmitting(true);
      setMessage(null);
      await createOrder({
        client_id: user?.id,
        livreur_id: null,
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
        statut: "en_attente",
      });

      setMessage({ type: "success", text: "Commande creee avec succes." });
      setTimeout(() => navigate("/client/dashboard"), 900);
    } catch (error) {
      setMessage({
        type: "danger",
        text: error.response?.data?.message || error.message || "Erreur lors de la creation de la commande.",
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ClientLayout title="Nouvelle Commande" subtitle="Creez une livraison avec les memes informations que le back-office.">
      {message && (
        <div className={`alert alert-${message.type} d-flex align-items-center`} role="alert">
          <i className={`bi bi-${message.type === "success" ? "check-circle" : "exclamation-triangle"} me-2`}></i>
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="client-card p-4 mb-4">
              <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                <i className="bi bi-box-seam me-2" style={{ color: "#2563eb" }}></i>
                Type de livraison
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={formData.type} onChange={(e) => setField("type", e.target.value)}>
                    <option value="Restaurant">Restaurant</option>
                    <option value="Pharmacie">Pharmacie</option>
                    <option value="Colis">Colis</option>
                    <option value="Courses">Courses</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Mode de paiement</label>
                  <select className="form-select" value={formData.paymentMode} onChange={(e) => setField("paymentMode", e.target.value)}>
                    <option value="Cash">Especes</option>
                    <option value="Card">Carte bancaire</option>
                    <option value="Mobile">Paiement mobile</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="row g-4 mb-4">
              <div className="col-md-6">
                <div className="client-card p-4 h-100">
                  <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                    <i className="bi bi-geo-alt me-2" style={{ color: "#10b981" }}></i>
                    Point de retrait
                  </h5>
                  <Field label="Nom" name="pickupName" value={formData.pickupName} error={errors.pickupName} onChange={setField} icon="bi-person" />
                  <Field label="Telephone" name="pickupPhone" value={formData.pickupPhone} error={errors.pickupPhone} onChange={setField} icon="bi-telephone" />
                  <Field as="textarea" label="Adresse" name="pickupAddress" value={formData.pickupAddress} error={errors.pickupAddress} onChange={setField} icon="bi-house" />
                </div>
              </div>

              <div className="col-md-6">
                <div className="client-card p-4 h-100">
                  <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                    <i className="bi bi-truck me-2" style={{ color: "#2563eb" }}></i>
                    Point de livraison
                  </h5>
                  <Field label="Nom" name="deliveryName" value={formData.deliveryName} error={errors.deliveryName} onChange={setField} icon="bi-person" />
                  <Field label="Telephone" name="deliveryPhone" value={formData.deliveryPhone} error={errors.deliveryPhone} onChange={setField} icon="bi-telephone" />
                  <Field as="textarea" label="Adresse" name="deliveryAddress" value={formData.deliveryAddress} error={errors.deliveryAddress} onChange={setField} icon="bi-house" />
                </div>
              </div>
            </div>

            <div className="client-card p-4">
              <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                <i className="bi bi-info-circle me-2" style={{ color: "#0ea5e9" }}></i>
                Details supplementaires
              </h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <Field type="number" label="Distance estimee (km)" name="distance" value={formData.distance} error={errors.distance} onChange={setField} icon="bi-rulers" step="0.1" />
                </div>
                <div className="col-md-6">
                  <Field as="textarea" label="Instructions speciales" name="instructions" value={formData.instructions} onChange={setField} icon="bi-chat-left-text" required={false} />
                </div>
              </div>
            </div>
          </div>

          <div className="col-lg-4">
            <div className="client-card p-4 sticky-top" style={{ top: "2rem" }}>
              <h5 className="fw-bold mb-4" style={{ color: "#1e293b" }}>
                <i className="bi bi-clipboard-check me-2" style={{ color: "#2563eb" }}></i>
                Resume
              </h5>

              <SummaryItem label="Type" value={formData.type} icon="bi-box-seam" />
              <SummaryItem label="Distance" value={`${formData.distance || 0} km`} icon="bi-rulers" />
              <SummaryItem label="Paiement" value={formData.paymentMode === "Cash" ? "Especes" : formData.paymentMode === "Card" ? "Carte" : "Mobile"} icon="bi-credit-card" />

              <div className="rounded-3 p-4 mb-4 text-white text-center client-gradient-btn">
                <small className="d-block opacity-75">Prix estime</small>
                <strong className="fs-2">{price.toFixed(2)} MAD</strong>
              </div>

              <div className="d-grid gap-2">
                <button className="btn client-gradient-btn" type="submit" disabled={submitting}>
                  {submitting ? <span className="spinner-border spinner-border-sm"></span> : <i className="bi bi-check-circle"></i>}
                  Creer la commande
                </button>
                <button className="btn btn-outline-secondary" type="button" disabled={submitting} onClick={() => navigate("/client/dashboard")}>
                  <i className="bi bi-x-circle"></i>
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </ClientLayout>
  );
};

const Field = ({ as = "input", type = "text", label, name, value, error, onChange, icon, required = true, ...props }) => {
  const Control = as;
  return (
    <div className="mb-3">
      <label className="form-label">
        <i className={`bi ${icon} me-1`} style={{ color: "#2563eb" }}></i>
        {label} {required && "*"}
      </label>
      <Control
        type={type}
        name={name}
        value={value}
        rows={as === "textarea" ? 3 : undefined}
        className={`form-control ${error ? "is-invalid" : ""}`}
        onChange={(e) => onChange(name, e.target.value)}
        {...props}
      />
      {error && <div className="invalid-feedback">{error}</div>}
    </div>
  );
};

const SummaryItem = ({ label, value, icon }) => (
  <div className="pb-3 mb-3 border-bottom">
    <small className="text-muted text-uppercase fw-semibold">{label}</small>
    <p className="fw-bold mb-0 mt-1" style={{ color: "#1e293b" }}>
      <i className={`bi ${icon} me-2`} style={{ color: "#2563eb" }}></i>
      {value}
    </p>
  </div>
);

export default NewOrder;
