import axios from "axios";

const API_URL = "http://localhost:5000/api/saved-job";

// GET saved jobs
export const getSavedJobs = async (token) => {
  const res = await axios.get(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};

// SAVE job
export const saveJob = async (jobId, token) => {
  const res = await axios.post(
    API_URL,
    { jobId },
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  );
  return res.data;
};

// REMOVE saved job
export const removeSavedJob = async (id, token) => {
  const res = await axios.delete(`${API_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return res.data;
};