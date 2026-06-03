import React, { useEffect, useState } from "react";
import { getClients, getClientById, updateClient, removeClient } from "../../services/userService";
import { useError } from "../../context/ErrorContext";
import { useLoading } from "../../context/LoadingContext";
import AdminLayout from "../../components/Layout/AdminLayout";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaUsers, FaEye, FaTrash, FaSpinner } from 'react-icons/fa';

const Clients = () => {
  const { handleApiError, handleSuccess } = useError();
  const { setLoading, isLoading } = useLoading();

  const [clients, setClients] = useState([]);
  const [selectedClient, setSelectedClient] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editData, setEditData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredClients, setFilteredClients] = useState([]);

  useEffect(() => {
    fetchClients();
  }, []);

  useEffect(() => {
    const filtered = clients.filter(client =>
      (client.prenom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone?.includes(searchTerm))
    );
    setFilteredClients(filtered);
  }, [searchTerm, clients]);

  const fetchClients = async () => {
    try {
      setLoading("clients", true);
      const data = await getClients();

      const clientsArray = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setClients(clientsArray);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("clients", false);
    }
  };

  const handleViewDetails = async (clientId) => {
    try {
      setLoading("clientDetails", true);
      const data = await getClientById(clientId);

      const clientData = data?.data || data;

      setSelectedClient(clientData);
      setEditData({
        prenom: clientData.prenom || "",
        nom: clientData.nom || "",
        email: clientData.email || "",
        telephone: clientData.telephone || ""
      });

      setEditMode(false);
      setShowModal(true);
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("clientDetails", false);
    }
  };

  const handleEditClick = () => setEditMode(true);

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async () => {
    if (!editData.prenom.trim() || !editData.nom.trim() || !editData.telephone.trim()) {
      handleApiError({ message: "Tous les champs sont requis" });
      return;
    }

    try {
      setLoading("saveClient", true);
      const updated = await updateClient(selectedClient.id, editData);

      const updatedClient = updated?.data || updated;

      setClients(prev =>
        prev.map(c => (c.id === selectedClient.id ? updatedClient : c))
      );

      setSelectedClient(updatedClient);
      setEditMode(false);
      handleSuccess("Client mis à jour avec succès!");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("saveClient", false);
    }
  };

  const handleDeleteClient = async (clientId) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce client?")) return;

    try {
      setLoading("deleteClient", true);
      await removeClient(clientId);

      setClients(prev => prev.filter(c => c.id !== clientId));
      setShowModal(false);
      handleSuccess("Client supprimé avec succès!");
    } catch (error) {
      handleApiError(error);
    } finally {
      setLoading("deleteClient", false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClient(null);
    setEditData({});
    setEditMode(false);
  };

  if (isLoading("clients")) {
    return (
      <AdminLayout title="Clients">
        <div className="text-center py-5">
          <FaSpinner className="spin" size={32} color="#3C5E82" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Clients">
      <div className="container-fluid p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="d-flex align-items-center">
            <FaUsers className="me-2" size={24} color="#3C5E82" />
            Clients
          </h2>
          <span className="badge bg-secondary">{filteredClients.length}</span>
        </div>

        <input
          type="text"
          className="form-control mb-3"
          placeholder="Recherche..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {filteredClients.length === 0 ? (
          <p className="text-muted">Aucun client trouvé</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Email</th>
                <th>Téléphone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredClients.map(client => (
                <tr key={client.id}>
                  <td>{client.prenom} {client.nom}</td>
                  <td>{client.email}</td>
                  <td>{client.telephone}</td>
                  <td>
                    <button className="btn btn-sm btn-primary me-2 d-flex align-items-center" onClick={() => handleViewDetails(client.id)}>
                      <FaEye size={14} />
                      <span className="ms-1">Voir</span>
                    </button>
                    <button className="btn btn-sm btn-danger d-flex align-items-center" onClick={() => handleDeleteClient(client.id)}>
                      <FaTrash size={14} />
                      <span className="ms-1">Supprimer</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && selectedClient && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content p-3">
              <h5>{selectedClient.prenom} {selectedClient.nom}</h5>
              <p>{selectedClient.email}</p>
              <p>{selectedClient.telephone}</p>

              <button className="btn btn-secondary mt-2" onClick={closeModal}>
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default Clients;