import axios from "axios";

const API_URL = "http://localhost:5000/api/magazine-user";

function getAuthConfig() {
    const token = localStorage.getItem("token");
    return {
        headers: {
            Authorization: `Bearer ${token}`
        }
    };
}

// Aligne le calcul exactement avec la page BuyBook
export async function getDeliveryInfo({ addressId, lat, lng }) {
    const response = await axios.post(
        `${API_URL}/delivery/custom`,
        { addressId, lat, lng },
        getAuthConfig()
    );
    return response.data;
}

export async function getDeliveryInfoByParams({ type, id }) {
    const response = await axios.get(
        `${API_URL}/delivery/${type}/${id}`,
        getAuthConfig()
    );
    return response.data;
}


