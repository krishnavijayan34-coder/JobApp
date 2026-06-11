import axios from "axios";

const API_URL = "http://localhost:5000/api";

export const getEmployerDashboard = async () => {
  const response = await axios.get(`${API_URL}/company`);
  return response.data;
};


export const createEmployerProfile = async (data) => {
  const response = await axios.post(
    `${API_URL}/company`,
    data
  );
  return response.data;
};

export const updateEmployerProfile = async (id, data) => {
  const response = await axios.put(
    `${API_URL}/company/${id}`,
    data
  );
  return response.data;
};