import api from "./api";

const extractData = (response) => {
  return response?.data || response || {};
};

export const getLivreurs = async () => {
  const response = await api.get("/livreurs");
  return extractData(response);
};

export const getLivreurById = async (id) => {
  const response = await api.get(`/livreurs/${id}`);
  return extractData(response);
};

export const createLivreur = async (data) => {
  const response = await api.post("/livreurs", data);
  return response.data;
};

export const updateLivreur = async (id, data) => {
  const response = await api.put(`/livreurs/${id}`, data);
  return response.data;
};

export const removeLivreur = async (id) => {
  const response = await api.delete(`/livreurs/${id}`);
  return response.data;
};

export const getLivreurStats = async (id = null) => {
  const url = id ? `/livreurs/${id}/stats` : "/livreurs/stats";
  const response = await api.get(url);
  return extractData(response);
};

export const getLivreurDeliveries = async (id = null) => {
  const url = id ? `/livreurs/${id}/deliveries` : "/livreurs/deliveries";
  const response = await api.get(url);
  return extractData(response);
};

export const getMyDeliveries = async () => {
  const response = await api.get("/livreurs/deliveries");
  return extractData(response);
};

export const getClients = async () => {
  const response = await api.get("/clients");
  return extractData(response);
};

export const getClientById = async (id) => {
  const response = await api.get(`/clients/${id}`);
  return extractData(response);
};

export const updateClient = async (id, data) => {
  const response = await api.put(`/clients/${id}`, data);
  return response.data;
};

export const removeClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return response.data;
};
