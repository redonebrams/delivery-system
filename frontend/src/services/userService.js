import api from "./api";

const extractData = (response) => {
  if (response?.data && typeof response.data === "object") {
    if ("success" in response.data && "data" in response.data) {
      return response.data.data || [];
    }
    return response.data;
  }

  return response || {};
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
  return extractData(response);
};

export const updateLivreur = async (id, data) => {
  const response = await api.put(`/livreurs/${id}`, data);
  return extractData(response);
};

export const removeLivreur = async (id) => {
  const response = await api.delete(`/livreurs/${id}`);
  return extractData(response);
};

export const getLivreurStats = async (id = null) => {
  const url = id ? `/livreurs/${id}/stats` : "/livreurs/me/stats";
  const response = await api.get(url);
  return extractData(response);
};

export const getLivreurDeliveries = async (id = null) => {
  const url = id ? `/livreurs/${id}/deliveries` : "/livreurs/me/deliveries";
  const response = await api.get(url);
  return extractData(response);
};

export const getMyDeliveries = async () => {
  const response = await api.get("/livreurs/me/deliveries");
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
  return extractData(response);
};

export const removeClient = async (id) => {
  const response = await api.delete(`/clients/${id}`);
  return extractData(response);
};
