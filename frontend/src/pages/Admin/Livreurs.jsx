 import React, { useEffect, useState } from "react"; 
import { 
  getLivreurs, 
  createLivreur, 
  updateLivreur, 
  removeLivreur,
  getLivreurById,
  getLivreurDeliveries,
  getLivreurStats
} from "../../services/userService";
import { useError } from "../../context/ErrorContext";
import { useLoading } from "../../context/LoadingContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

const Livreurs = () => {
  const { handleApiError, handleSuccess } = useError();
  const { setLoading, isLoading } = useLoading();

  // State Management
  const [livreurs, setLivreurs] = useState([]);
  const [selectedLivreur, setSelectedLivreur] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("view"); // view, edit, create, stats
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("tous");
  const [vehicleFilter, setVehicleFilter] = useState("tous");
  const [filteredLivreurs, setFilteredLivreurs] = useState([]);
  const [livreurStats, setLivreurStats] = useState(null);
  const [deliveriesHistory, setDeliveriesHistory] = useState([]);
  const [sortBy, setSortBy] = useState("nom");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Form Data for Create/Edit
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    password: "",
    confirmPassword: "",
    type_vehicule: "moto",
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    fetchLivreurs();
  }, []);

  useEffect(() => {
    let filtered = livreurs.filter(livreur => {
      const matchSearch =
        (livreur.prenom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (livreur.nom || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (livreur.email || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
        (livreur.telephone || "").includes(searchTerm);

      const matchStatus =
        statusFilter === "tous" ||
        (livreur.statut || "disponible") === statusFilter;

      const matchVehicle =
        vehicleFilter === "tous" ||
        (livreur.type_vehicule || "").toLowerCase() === vehicleFilter.toLowerCase();

      return matchSearch && matchStatus && matchVehicle;
    });

    // Apply sorting
    filtered = filtered.sort((a, b) => {
      if (sortBy === "nom") {
        return (a.nom || "").localeCompare(b.nom || "");
      } else if (sortBy === "statut") {
        return ((a.statut || "") || "").localeCompare((b.statut || "") || "");
      } else if (sortBy === "deliveries") {
        return (b.total_livraisons || 0) - (a.total_livraisons || 0);
      }
      return 0;
    });

    setFilteredLivreurs(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, vehicleFilter, livreurs, sortBy]);

  const fetchLivreurs = async () => {
    try {
      setLoading("livreurs", true);
      const data = await getLivreurs();
      setLivreurs(Array.isArray(data?.data) ? data.data : Array.isArray(data) ? data : []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("livreurs", false);
    }
  };

  // Form Validation Functions
  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const validateMoroccanPhone = (phone) => {
    const regex = /^(06|07)[0-9]{8}$/;
    return regex.test(phone.replace(/\s/g, ""));
  };

  const validatePassword = (password) => {
    // At least 8 characters, one uppercase, one lowercase, one number
    return password.length >= 8 && /[A-Z]/.test(password) && /[a-z]/.test(password) && /[0-9]/.test(password);
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.nom.trim()) errors.nom = "Le nom est requis";
    if (!formData.prenom.trim()) errors.prenom = "Le prénom est requis";
    if (!formData.email.trim()) errors.email = "L'email est requis";
    else if (!validateEmail(formData.email)) errors.email = "Format email invalide";

    if (!formData.telephone.trim()) errors.telephone = "Le téléphone est requis";
    else if (!validateMoroccanPhone(formData.telephone)) {
      errors.telephone = "Format marocain requis (06/07XXXXXXXX)";
    }

    if (modalMode === "create") {
      if (!formData.password) errors.password = "Le mot de passe est requis";
      else if (!validatePassword(formData.password)) {
        errors.password = "Min 8 caractères, 1 majuscule, 1 minuscule, 1 chiffre";
      }
      if (formData.password !== formData.confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleOpenCreateModal = () => {
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
      type_vehicule: "moto",
    });
    setFormErrors({});
    setModalMode("create");
    setShowModal(true);
  };

  const handleOpenViewModal = async (livreur) => {
    setSelectedLivreur(livreur);
    setFormData({
      nom: livreur.nom,
      prenom: livreur.prenom,
      email: livreur.email,
      telephone: livreur.telephone,
      type_vehicule: livreur.type_vehicule || "moto",
    });
    setFormErrors({});
    setModalMode("view");
    setShowModal(true);
  };

  const handleOpenEditModal = async (livreur) => {
    setSelectedLivreur(livreur);
    setFormData({
      nom: livreur.nom,
      prenom: livreur.prenom,
      email: livreur.email,
      telephone: livreur.telephone,
      type_vehicule: livreur.type_vehicule || "moto",
    });
    setFormErrors({});
    setModalMode("edit");
    setShowModal(true);
  };

  const handleOpenStatsModal = async (livreur) => {
    setSelectedLivreur(livreur);
    try {
      setLoading("stats", true);
      const stats = await getLivreurStats(livreur.id);
      const deliveries = await getLivreurDeliveries(livreur.id);
      setLivreurStats(stats);
      setDeliveriesHistory(Array.isArray(deliveries) ? deliveries : []);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("stats", false);
    }
    setModalMode("stats");
    setShowModal(true);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCreateLivreur = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading("createLivreur", true);
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        email: formData.email,
        telephone: formData.telephone,
        password: formData.password,
        type_vehicule: formData.type_vehicule,
        role: "livreur"
      };

      await createLivreur(payload);
      handleSuccess("Livreur créé avec succès!");
      closeModal();
      await fetchLivreurs();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("createLivreur", false);
    }
  };

  const handleUpdateLivreur = async (e) => {
    e.preventDefault();
    if (!selectedLivreur) return;
    if (!validateForm()) return;

    try {
      setLoading("updateLivreur", true);
      const payload = {
        nom: formData.nom,
        prenom: formData.prenom,
        telephone: formData.telephone,
        type_vehicule: formData.type_vehicule,
      };

      await updateLivreur(selectedLivreur.id, payload);
      handleSuccess("Livreur mis à jour avec succès!");
      closeModal();
      await fetchLivreurs();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("updateLivreur", false);
    }
  };

  const handleDeleteLivreur = async () => {
    if (!selectedLivreur) return;
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce livreur?")) return;

    try {
      setLoading("deleteLivreur", true);
      await removeLivreur(selectedLivreur.id);
      handleSuccess("Livreur supprimé avec succès!");
      closeModal();
      await fetchLivreurs();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("deleteLivreur", false);
    }
  };

  const handleToggleStatus = async (livreur) => {
    const newStatus = livreur.statut === "indisponible" ? "disponible" : "indisponible";
    try {
      setLoading("toggleStatus", true);
      await updateLivreur(livreur.id, { statut: newStatus });
      handleSuccess(`Livreur ${newStatus === "disponible" ? "activé" : "désactivé"}!`);
      await fetchLivreurs();
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("toggleStatus", false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedLivreur(null);
    setModalMode("view");
    setFormData({
      nom: "",
      prenom: "",
      email: "",
      telephone: "",
      password: "",
      confirmPassword: "",
      type_vehicule: "moto",
    });
    setFormErrors({});
    setLivreurStats(null);
    setDeliveriesHistory([]);
  };

  const getStatusColor = (status) => {
    const map = {
      disponible: { bg: "#10b981", label: "Disponible" },
      en_livraison: { bg: "#0ea5e9", label: "En livraison" },
      indisponible: { bg: "#ef4444", label: "Indisponible" }
    };
    return map[status || "disponible"] || { bg: "#64748b", label: status || "N/A" };
  };

  const getVehicleIcon = (type) => {
    const map = {
      moto: "bi-fire",
      voiture: "bi-car-front",
      velo: "bi-bicycle"
    };
    return map[type?.toLowerCase() || "moto"] || "bi-fire";
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentLivreurs = filteredLivreurs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredLivreurs.length / itemsPerPage);

  if (isLoading("livreurs")) {
    return (
      <AdminLayout title="Gestion des Livreurs">
        <div className="text-center py-5">
          <div className="spinner-border text-primary"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Gestion des Livreurs">
      {/* Header Stats  */}
      <div className="row mb-4 g-3">
        <div className="col-md-3">
          <div className="card rounded-4 border" style={{ borderColor: "#e2e8f0", background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)" }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1" style={{ opacity: 0.9 }}>Livreurs Totaux</p>
                  <h3 className="fw-bold mb-0">{livreurs.length}</h3>
                </div>
                <i className="bi bi-truck" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card rounded-4 border" style={{ borderColor: "#e2e8f0", background: "linear-gradient(135deg, #10b981 0%, #059669 100%)" }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1" style={{ opacity: 0.9 }}>Disponibles</p>
                  <h3 className="fw-bold mb-0">
                    {livreurs.filter(l => l.statut === "disponible" || !l.statut).length}
                  </h3>
                </div>
                <i className="bi bi-check-circle" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card rounded-4 border" style={{ borderColor: "#e2e8f0", background: "linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)" }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1" style={{ opacity: 0.9 }}>En Livraison</p>
                  <h3 className="fw-bold mb-0">
                    {livreurs.filter(l => l.statut === "en_livraison").length}
                  </h3>
                </div>
                <i className="bi bi-box-seam" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card rounded-4 border" style={{ borderColor: "#e2e8f0", background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
            <div className="card-body p-4 text-white">
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <p className="mb-1" style={{ opacity: 0.9 }}>Inactifs</p>
                  <h3 className="fw-bold mb-0">
                    {livreurs.filter(l => l.statut === "indisponible").length}
                  </h3>
                </div>
                <i className="bi bi-x-circle" style={{ fontSize: "2rem", opacity: 0.3 }}></i>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="card rounded-4 border mb-4" style={{ borderColor: "#e2e8f0" }}>
        <div className="card-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0 fw-bold">Filtres et Recherche</h5>
            <button 
              className="btn btn-sm"
              style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)", color: "white", border: "none" }}
              onClick={handleOpenCreateModal}
            >
              <i className="bi bi-plus-circle me-2"></i>Ajouter Livreur
            </button>
          </div>

          <div className="row g-3">
            <div className="col-md-3">
              <input
                type="text"
                className="form-control rounded-3"
                placeholder="Rechercher par nom, email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
              />
            </div>
            <div className="col-md-2">
              <select
                className="form-select rounded-3"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
              >
                <option value="tous">Tous Statuts</option>
                <option value="disponible">Disponible</option>
                <option value="en_livraison">En Livraison</option>
                <option value="indisponible">Inactif</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select rounded-3"
                value={vehicleFilter}
                onChange={(e) => setVehicleFilter(e.target.value)}
                style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
              >
                <option value="tous">Tous Véhicules</option>
                <option value="moto">Moto</option>
                <option value="voiture">Voiture</option>
                <option value="velo">Vélo</option>
              </select>
            </div>
            <div className="col-md-2">
              <select
                className="form-select rounded-3"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
              >
                <option value="nom">Tri: Nom A-Z</option>
                <option value="statut">Tri: Statut</option>
                <option value="deliveries">Tri: Livraisons</option>
              </select>
            </div>
            <div className="col-md-3">
              <button 
                className="btn btn-outline-secondary w-100 rounded-3"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("tous");
                  setVehicleFilter("tous");
                  setSortBy("nom");
                }}
              >
                <i className="bi bi-arrow-clockwise me-2"></i>Réinitialiser
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Livreurs Table */}
      <div className="card rounded-4 border" style={{ borderColor: "#e2e8f0" }}>
        <div className="card-body p-4">
          {filteredLivreurs.length === 0 ? (
            <div className="text-center py-5">
              <i className="bi bi-inbox" style={{ fontSize: "2rem", color: "#cbd5e1" }}></i>
              <p className="text-muted mt-3">Aucun livreur trouvé</p>
            </div>
          ) : (
            <>
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead style={{ background: "#f8fafc", borderBottom: "2px solid #e2e8f0" }}>
                    <tr>
                      <th style={{ color: "#475569", fontWeight: "600" }}>Nom Complet</th>
                      <th style={{ color: "#475569", fontWeight: "600" }}>Email</th>
                      <th style={{ color: "#475569", fontWeight: "600" }}>Téléphone</th>
                      <th style={{ color: "#475569", fontWeight: "600" }}>Véhicule</th>
                      <th style={{ color: "#475569", fontWeight: "600" }}>Statut</th>
                      <th style={{ color: "#475569", fontWeight: "600" }}>Livraisons</th>
                      <th style={{ color: "#475569", fontWeight: "600" }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentLivreurs.map(livreur => {
                      const status = getStatusColor(livreur.statut);
                      return (
                        <tr key={livreur.id} style={{ borderColor: "#e2e8f0" }}>
                          <td style={{ color: "#1e293b", fontWeight: "500" }}>
                            {livreur.prenom} {livreur.nom}
                          </td>
                          <td style={{ color: "#475569" }}>
                            {livreur.email}
                          </td>
                          <td style={{ color: "#475569" }}>
                            {livreur.telephone}
                          </td>
                          <td>
                            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                              <i className={`bi ${getVehicleIcon(livreur.type_vehicule)}`} style={{ color: "#2563eb" }}></i>
                              <span style={{ color: "#475569", textTransform: "capitalize" }}>
                                {livreur.type_vehicule || "Moto"}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span style={{
                              background: status.bg,
                              color: "white",
                              padding: "0.5rem 1.5rem",
                              borderRadius: "20px",
                              fontSize: "0.875rem",
                              fontWeight: "500"
                            }}>
                              {status.label}
                            </span>
                          </td>
                          <td>
                            <span style={{
                              background: "#f0f9ff",
                              color: "#0284c7",
                              padding: "0.5rem 1rem",
                              borderRadius: "8px",
                              fontWeight: "600"
                            }}>
                              {livreur.total_livraisons || 0}
                            </span>
                          </td>
                          <td>
                            <div style={{ display: "flex", gap: "0.5rem" }}>
                              <button 
                                className="btn btn-sm"
                                style={{ 
                                  background: "#f0f9ff", 
                                  color: "#2563eb", 
                                  border: "none",
                                  padding: "0.5rem 0.75rem"
                                }}
                                onClick={() => handleOpenViewModal(livreur)}
                                title="Voir les détails"
                              >
                                <i className="bi bi-eye"></i>
                              </button>
                              <button 
                                className="btn btn-sm"
                                style={{ 
                                  background: "#fef3c7", 
                                  color: "#d97706", 
                                  border: "none",
                                  padding: "0.5rem 0.75rem"
                                }}
                                onClick={() => handleOpenEditModal(livreur)}
                                title="Modifier"
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button 
                                className="btn btn-sm"
                                style={{ 
                                  background: "#fef2f2", 
                                  color: "#ef4444", 
                                  border: "none",
                                  padding: "0.5rem 0.75rem"
                                }}
                                onClick={() => handleOpenStatsModal(livreur)}
                                title="Voir les statistiques"
                              >
                                <i className="bi bi-graph-up"></i>
                              </button>
                              <button 
                                className="btn btn-sm"
                                style={{ 
                                  background: livreur.statut === "indisponible" ? "#f0fdf4" : "#fef2f2", 
                                  color: livreur.statut === "indisponible" ? "#10b981" : "#ef4444", 
                                  border: "none",
                                  padding: "0.5rem 0.75rem"
                                }}
                                onClick={() => handleToggleStatus(livreur)}
                                title={livreur.statut === "indisponible" ? "Activer" : "Désactiver"}
                              >
                                <i className={`bi ${livreur.statut === "indisponible" ? "bi-toggle-off" : "bi-toggle-on"}`}></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-between align-items-center mt-4 pt-3" style={{ borderTop: "1px solid #e2e8f0" }}>
                  <span style={{ color: "#64748b", fontSize: "0.875rem" }}>
                    Affichage {indexOfFirstItem + 1} à {Math.min(indexOfLastItem, filteredLivreurs.length)} sur {filteredLivreurs.length}
                  </span>
                  <nav>
                    <ul className="pagination mb-0">
                      <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage - 1)}
                          disabled={currentPage === 1}
                        >
                          Précédent
                        </button>
                      </li>
                      {[...Array(totalPages)].map((_, i) => (
                        <li key={i + 1} className={`page-item ${currentPage === i + 1 ? "active" : ""}`}>
                          <button 
                            className="page-link"
                            onClick={() => setCurrentPage(i + 1)}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}
                      <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
                        <button 
                          className="page-link"
                          onClick={() => setCurrentPage(currentPage + 1)}
                          disabled={currentPage === totalPages}
                        >
                          Suivant
                        </button>
                      </li>
                    </ul>
                  </nav>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)", zIndex: 9999 }}>
          <div className="modal-dialog modal-lg" style={{ maxHeight: "90vh", overflowY: "auto" }}>
            <div className="modal-content rounded-4" style={{ border: "none", boxShadow: "0 20px 25px rgba(0,0,0,0.15)" }}>
              {/* Modal Header */}
              <div className="modal-header" style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)", color: "white", borderRadius: "1rem 1rem 0 0", borderBottom: "none", padding: "1.5rem" }}>
                <h5 className="fw-bold mb-0">
                  {modalMode === "create" && <><i className="bi bi-plus-circle me-2"></i>Ajouter un Livreur</>}
                  {modalMode === "edit" && <><i className="bi bi-pencil-square me-2"></i>Modifier Livreur: {selectedLivreur?.prenom} {selectedLivreur?.nom}</>}
                  {modalMode === "view" && <><i className="bi bi-person-circle me-2"></i>Détails Livreur: {selectedLivreur?.prenom} {selectedLivreur?.nom}</>}
                  {modalMode === "stats" && <><i className="bi bi-graph-up me-2"></i>Statistiques Livreur: {selectedLivreur?.prenom} {selectedLivreur?.nom}</>}
                </h5>
                <button 
                  className="btn-close btn-close-white"
                  onClick={closeModal}
                  style={{ filter: "brightness(0.9)" }}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body p-4" style={{ maxHeight: "calc(90vh - 180px)", overflowY: "auto" }}>
                {/* Create/Edit Form */}
                {(modalMode === "create" || modalMode === "edit") && (
                  <form onSubmit={modalMode === "create" ? handleCreateLivreur : handleUpdateLivreur}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Prénom</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          name="prenom"
                          value={formData.prenom}
                          onChange={handleFormChange}
                          style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
                        />
                        {formErrors.prenom && <small style={{ color: "#ef4444" }}>{formErrors.prenom}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Nom</label>
                        <input
                          type="text"
                          className="form-control rounded-3"
                          name="nom"
                          value={formData.nom}
                          onChange={handleFormChange}
                          style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
                        />
                        {formErrors.nom && <small style={{ color: "#ef4444" }}>{formErrors.nom}</small>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Email</label>
                        <input
                          type="email"
                          className="form-control rounded-3"
                          name="email"
                          value={formData.email}
                          onChange={handleFormChange}
                          disabled={modalMode === "edit"}
                          style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
                        />
                        {formErrors.email && <small style={{ color: "#ef4444" }}>{formErrors.email}</small>}
                      </div>
                      <div className="col-md-6">
                        <label className="form-label fw-bold">Téléphone</label>
                        <input
                          type="tel"
                          className="form-control rounded-3"
                          name="telephone"
                          placeholder="06XXXXXXXX ou 07XXXXXXXX"
                          value={formData.telephone}
                          onChange={handleFormChange}
                          style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
                        />
                        {formErrors.telephone && <small style={{ color: "#ef4444" }}>{formErrors.telephone}</small>}
                      </div>

                      <div className="col-md-6">
                        <label className="form-label fw-bold">Type de Véhicule</label>
                        <select
                          className="form-select rounded-3"
                          name="type_vehicule"
                          value={formData.type_vehicule}
                          onChange={handleFormChange}
                          style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
                        >
                          <option value="moto">Moto</option>
                          <option value="voiture">Voiture</option>
                          <option value="velo">Vélo</option>
                        </select>
                      </div>

                      {modalMode === "create" && (
                        <>
                          <div className="col-md-6">
                            <label className="form-label fw-bold">Mot de Passe</label>
                            <input
                              type="password"
                              className="form-control rounded-3"
                              name="password"
                              placeholder="Min 8 caractères"
                              value={formData.password}
                              onChange={handleFormChange}
                              style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
                            />
                            {formErrors.password && <small style={{ color: "#ef4444" }}>{formErrors.password}</small>}
                            <small style={{ color: "#64748b", display: "block", marginTop: "0.5rem" }}>
                              1 majuscule, 1 minuscule, 1 chiffre requis
                            </small>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label fw-bold">Confirmer Mot de Passe</label>
                            <input
                              type="password"
                              className="form-control rounded-3"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleFormChange}
                              style={{ borderColor: "#e2e8f0", padding: "0.75rem 1rem" }}
                            />
                            {formErrors.confirmPassword && <small style={{ color: "#ef4444" }}>{formErrors.confirmPassword}</small>}
                          </div>
                        </>
                      )}
                    </div>
                  </form>
                )}

                {/* View Mode */}
                {modalMode === "view" && selectedLivreur && (
                  <div className="row g-4">
                    <div className="col-md-6">
                      <div style={{
                        background: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "1rem",
                        border: "1px solid #e2e8f0"
                      }}>
                        <label style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Prénom</label>
                        <p style={{ color: "#1e293b", fontWeight: "500", marginTop: "0.5rem" }}>
                          {selectedLivreur.prenom}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{
                        background: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "1rem",
                        border: "1px solid #e2e8f0"
                      }}>
                        <label style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Nom</label>
                        <p style={{ color: "#1e293b", fontWeight: "500", marginTop: "0.5rem" }}>
                          {selectedLivreur.nom}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{
                        background: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "1rem",
                        border: "1px solid #e2e8f0"
                      }}>
                        <label style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Email</label>
                        <p style={{ color: "#1e293b", fontWeight: "500", marginTop: "0.5rem" }}>
                          {selectedLivreur.email}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{
                        background: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "1rem",
                        border: "1px solid #e2e8f0"
                      }}>
                        <label style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Téléphone</label>
                        <p style={{ color: "#1e293b", fontWeight: "500", marginTop: "0.5rem" }}>
                          {selectedLivreur.telephone}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{
                        background: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "1rem",
                        border: "1px solid #e2e8f0"
                      }}>
                        <label style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Type de Véhicule</label>
                        <p style={{ color: "#1e293b", fontWeight: "500", marginTop: "0.5rem", textTransform: "capitalize" }}>
                          <i className={`bi ${getVehicleIcon(selectedLivreur.type_vehicule)} me-2`}></i>
                          {selectedLivreur.type_vehicule || "Moto"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div style={{
                        background: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "1rem",
                        border: "1px solid #e2e8f0"
                      }}>
                        <label style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Statut</label>
                        <div style={{ marginTop: "0.5rem" }}>
                          <span style={{
                            background: getStatusColor(selectedLivreur.statut).bg,
                            color: "white",
                            padding: "0.5rem 1rem",
                            borderRadius: "20px",
                            fontSize: "0.875rem",
                            fontWeight: "500",
                            display: "inline-block"
                          }}>
                            {getStatusColor(selectedLivreur.statut).label}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="col-12">
                      <div style={{
                        background: "#f8fafc",
                        padding: "1.5rem",
                        borderRadius: "1rem",
                        border: "1px solid #e2e8f0"
                      }}>
                        <label style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Livraisons Complétées</label>
                        <p style={{ color: "#1e293b", fontWeight: "500", marginTop: "0.5rem", fontSize: "1.5rem" }}>
                          {selectedLivreur.total_livraisons || 0}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Statistics Mode */}
                {modalMode === "stats" && selectedLivreur && (
                  <div>
                    {isLoading("stats") ? (
                      <div className="text-center py-5">
                        <div className="spinner-border text-primary"></div>
                      </div>
                    ) : (
                      <div className="row g-3 mb-4">
                        <div className="col-md-4">
                          <div className="card rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                            <div className="card-body text-center">
                              <p style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Livraisons Aujourd'hui</p>
                              <h3 className="fw-bold text-primary mb-0">
                                {livreurStats?.today || 0}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                            <div className="card-body text-center">
                              <p style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>En Cours</p>
                              <h3 className="fw-bold" style={{ color: "#f59e0b" }}>
                                {livreurStats?.ongoing || 0}
                              </h3>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="card rounded-3 border" style={{ borderColor: "#e2e8f0" }}>
                            <div className="card-body text-center">
                              <p style={{ color: "#64748b", fontSize: "0.875rem", fontWeight: "600" }}>Total</p>
                              <h3 className="fw-bold" style={{ color: "#10b981" }}>
                                {livreurStats?.total || 0}
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <h6 className="fw-bold mt-4 mb-3">Historique des Livraisons Récentes</h6>
                    {deliveriesHistory.length === 0 ? (
                      <div className="text-center py-4">
                        <p style={{ color: "#cbd5e1" }}>Aucune livraison</p>
                      </div>
                    ) : (
                      <div className="table-responsive">
                        <table className="table table-sm">
                          <thead style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                            <tr>
                              <th style={{ color: "#475569", fontWeight: "600", fontSize: "0.875rem" }}>Commande</th>
                              <th style={{ color: "#475569", fontWeight: "600", fontSize: "0.875rem" }}>Date</th>
                              <th style={{ color: "#475569", fontWeight: "600", fontSize: "0.875rem" }}>Statut</th>
                            </tr>
                          </thead>
                          <tbody>
                            {deliveriesHistory.slice(0, 10).map(delivery => (
                              <tr key={delivery.id} style={{ borderColor: "#e2e8f0" }}>
                                <td style={{ color: "#475569", fontSize: "0.875rem" }}>#{delivery.id}</td>
                                <td style={{ color: "#475569", fontSize: "0.875rem" }}>
                                  {new Date(delivery.created_at).toLocaleDateString("fr-FR")}
                                </td>
                                <td>
                                  <span style={{
                                    background: getStatusColor(delivery.statut).bg,
                                    color: "white",
                                    padding: "0.25rem 0.75rem",
                                    borderRadius: "12px",
                                    fontSize: "0.75rem",
                                    fontWeight: "500"
                                  }}>
                                    {getStatusColor(delivery.statut).label}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Modal Footer */}
              <div className="modal-footer" style={{ padding: "1.5rem", borderTop: "1px solid #e2e8f0" }}>
                {modalMode === "create" && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary rounded-3"
                      onClick={closeModal}
                    >
                      Annuler
                    </button>
                    <button 
                      type="button" 
                      className="btn rounded-3 text-white"
                      style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)" }}
                      onClick={handleCreateLivreur}
                      disabled={isLoading("createLivreur")}
                    >
                      {isLoading("createLivreur") ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Création...
                        </>
                      ) : (
                        <><i className="bi bi-check-circle me-2"></i>Créer Livreur</>
                      )}
                    </button>
                  </>
                )}

                {modalMode === "edit" && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary rounded-3"
                      onClick={closeModal}
                    >
                      Annuler
                    </button>
                    <button 
                      type="button" 
                      className="btn btn-danger rounded-3"
                      onClick={handleDeleteLivreur}
                      disabled={isLoading("deleteLivreur")}
                    >
                      {isLoading("deleteLivreur") ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Suppression...
                        </>
                      ) : (
                        <><i className="bi bi-trash me-2"></i>Supprimer</>
                      )}
                    </button>
                    <button 
                      type="button" 
                      className="btn rounded-3 text-white"
                      style={{ background: "linear-gradient(135deg, #2563eb 0%, #0ea5e9 100%)" }}
                      onClick={handleUpdateLivreur}
                      disabled={isLoading("updateLivreur")}
                    >
                      {isLoading("updateLivreur") ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2"></span>
                          Mise à jour...
                        </>
                      ) : (
                        <><i className="bi bi-check-circle me-2"></i>Enregistrer</>
                      )}
                    </button>
                  </>
                )}

                {(modalMode === "view" || modalMode === "stats") && (
                  <>
                    <button 
                      type="button" 
                      className="btn btn-outline-secondary rounded-3"
                      onClick={closeModal}
                    >
                      Fermer
                    </button>
                    {modalMode === "view" && (
                      <button 
                        type="button" 
                        className="btn rounded-3 text-white"
                        style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}
                        onClick={() => handleOpenEditModal(selectedLivreur)}
                      >
                        <i className="bi bi-pencil-square me-2"></i>Modifier
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Livreurs;