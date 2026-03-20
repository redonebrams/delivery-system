import api from "./api";


export const getLivreurs = async () => {
  const response = await api.get("/livreurs");
  return response.data;
};

export const createLivreur = async (data) => {
  const response = await api.post("/livreurs", data);
  return response.data;
};

export const getLivreurStats = async () => {
  const response = await api.get("/livreurs/stats");
  return response.data;
};


export const getClients = async () => {
  const response = await api.get("/clients");
  return response.data;
};