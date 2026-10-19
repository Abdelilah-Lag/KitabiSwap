import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

function apiBase() {
  return API || "http://localhost:5000";
}

function authConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
}

export async function getPendingSellSubmissions() {
  const response = await axios.get(
    `${apiBase()}/api/warehouse/sell-submissions`,
    authConfig()
  );
  return response.data;
}

export async function getSubmissionDetails(id) {
  const response = await axios.get(
    `${apiBase()}/api/warehouse/sell-submissions/${id}`,
    authConfig()
  );
  return response.data;
}

export async function approveSubmission(id) {
  const response = await axios.post(
    `${apiBase()}/api/warehouse/sell-submissions/${id}/approve`,
    {},
    authConfig()
  );
  return response.data;
}

export async function rejectSubmission(id) {
  const response = await axios.delete(
    `${apiBase()}/api/warehouse/sell-submissions/${id}/reject`,
    authConfig()
  );
  return response.data;
}

