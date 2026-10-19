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

export async function getInventory({ page = 1, pageSize = 25, q, status, featured, low_stock } = {}) {
    const params = {
        page,
        pageSize,
        ...(q ? { q } : {}),
        ...(status ? { status } : {}),
        ...(featured !== undefined ? { featured } : {}),
        ...(low_stock !== undefined ? { low_stock } : {})
    };

    const response = await axios.get(
        `${apiBase()}/api/warehouse/inventory`,
        { ...config(), params }
    );

    return response.data;
}

export async function searchCatalog({ q, category, page = 1, pageSize = 10 } = {}) {
    const params = {
        page,
        pageSize,
        ...(q ? { q } : {}),
        ...(category ? { category } : {})
    };

    const response = await axios.get(
        `${apiBase()}/api/warehouse/inventory/catalog/search`,
        { ...config(), params }
    );

    return response.data;
}

export async function addToStock(payload) {
    const response = await axios.post(
        `${apiBase()}/api/warehouse/inventory`,
        payload,
        config()
    );

    return response.data;
}

export async function updateInventory(id, payload) {
    const response = await axios.put(
        `${apiBase()}/api/warehouse/inventory/${id}`,
        payload,
        config()
    );

    return response.data;
}

export async function deleteInventory(id) {
    const response = await axios.delete(
        `${apiBase()}/api/warehouse/inventory/${id}`,
        config()
    );

    return response.data;
}

