import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

function apiBase() {
    return API || "http://localhost:5000";
}

function config() {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };
}

/* ==========================================
   DASHBOARD
========================================== */

export async function getDashboard() {

    const response = await axios.get(
        `${apiBase()}/api/warehouse/dashboard`,
        config()
    );

    return response.data;
}

/* ==========================================
   HEADER USER
========================================== */

export async function getWarehouseHeader() {

    const response = await axios.get(
        `${apiBase()}/api/warehouse/header`,
        config()
    );

    return response.data;
}