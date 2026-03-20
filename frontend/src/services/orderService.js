import api from "./api";

export const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData);
  return response.data;
};

export const getOrders = async () => {
  const response = await api.get("/orders");
  return response.data;
};

export const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`);
  return response.data;
};

export const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status });
  return response.data;
};

export const assignLivreur = async (orderId, livreurId) => {
  const response = await api.put(`/orders/${orderId}/assign`, { livreurId });
  return response.data;
};

export const getAdminStats = async () => {
  const response = await api.get("/admin/stats");
  return response.data;
};

export const getTarifs = async () => {
  const response = await api.get("/settings/tarifs");
  return response.data;
};

export const updateTarifs = async (tarifs) => {
  const response = await api.put("/settings/tarifs", tarifs);
  return response.data;
};

export const getMyDeliveries = async () => {
  const response = await api.get("/livreur/deliveries");
  return response.data;
};
