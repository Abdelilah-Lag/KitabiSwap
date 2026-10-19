import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

function apiBase() {
    if (API) return API;
    return "http://localhost:5000";
}

/*
==========================================================
AUTH HEADER
==========================================================
*/

function getConfig() {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

/*
==========================================================
SUBMIT CONTACT MESSAGE
==========================================================
*/

export async function submitContactMessage({ name, email, subject, message }) {
    const response = await axios.post(
        `${apiBase()}/api/contact`,
        { name, email, subject, message },
        getConfig()
    );
    return response.data;
}

