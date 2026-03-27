import api from "./api";

// Utility function to extract data from formatted response
const extractData = (response) => {
  // Check if response is in the backend format (has success, data, message)  
  if (response?.data && typeof response.data === 'object') {
    if ('success' in response.data && 'data' in response.data) {
      return response.data.data || [];
    }
    return response.data;
  }
  return [];
};

export const createOrder = async (orderData) => {
  const response = await api.post("/commandes", orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/commandes");
  return extractData(response);
};

export const getOrderById = async (id) => {
  const response = await api.get(`/commandes/${id}`);
  return extractData(response);
};

export const updateOrder = async (id, data) => {
  const response = await api.put(`/commandes/${id}`, data);
  return response.data;
};

export const updateOrderStatus = async (id, statut) => {
  const response = await api.put(`/commandes/${id}/statut`, { statut });
  return response.data;
};

export const assignLivreur = async (orderId, livreur_id) => {
  const response = await api.put(`/commandes/${orderId}/assigner`, { livreur_id });
  return response.data;
};

export const deleteOrder = async (id) => {
  const response = await api.delete(`/commandes/${id}`);
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/stats/dashboard");
  return extractData(response);
};

export const getTarifs = async () => {
  const response = await api.get("/stats/tarifs");
  return extractData(response);
};

export const updateTarifs = async (tarifs) => {
  const response = await api.put("/stats/tarifs", tarifs);
  return response.data;
};

export const getMyDeliveries = async () => {
  const response = await api.get("/livreurs/deliveries");
  return extractData(response);
};

export const getDeliveryById = async (id) => {
  const response = await api.get(`/commandes/${id}`);
  return extractData(response);
};

