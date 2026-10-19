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

export async function getControllerDashboard() {
    const response = await axios.get(
        `${apiBase()}/api/controller/dashboard`,
        config()
    );

    return response.data;
}

