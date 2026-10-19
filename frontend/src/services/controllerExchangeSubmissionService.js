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

export async function getPendingExchangeSubmissions() {
  const response = await axios.get(
    `${apiBase()}/api/controller/exchange-submissions`,
    authConfig()
  );
  return response.data;
}

export async function getExchangeSubmissionDetails(id) {
  const response = await axios.get(
    `${apiBase()}/api/controller/exchange-submissions/${id}`,
    authConfig()
  );
  return response.data;
}

export async function approveExchangeSubmission(id, catalogData) {
  const response = await axios.post(
    `${apiBase()}/api/controller/exchange-submissions/${id}/approve`,
    { catalog_data: catalogData || null },
    authConfig()
  );
  return response.data;
}

export async function rejectExchangeSubmission(id) {
  const response = await axios.delete(
    `${apiBase()}/api/controller/exchange-submissions/${id}/reject`,
    authConfig()
  );
  return response.data;
}

