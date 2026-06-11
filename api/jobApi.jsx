import axios from "axios";

const API_URL = "http://localhost:5000/api/jobs";


export const getAllJobs = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return [];
  }
};


export const getJobById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching job:", error);
    return null;
  }
};

export const createJob = async (jobData, token) => {
  try {
    const response = await axios.post(API_URL, jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error creating job:", error);
    return null;
  }
};


export const updateJob = async (id, jobData, token) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, jobData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error updating job:", error);
    return null;
  }
};


export const deleteJob = async (id, token) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error deleting job:", error);
    return null;
  }
};