import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "") || "http://localhost:5000";

function config() {
    return {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
        }
    };
}

export async function getDashboard() {
    const res = await axios.get(`${API}/api/admin/dashboard`, config());
    return res.data;
}

export async function getUsers(params) {
    const res = await axios.get(`${API}/api/admin/users`, { ...config(), params });
    return res.data;
}

export async function getUser(id) {
    const res = await axios.get(`${API}/api/admin/users/${id}`, config());
    return res.data;
}

export async function updateUser(id, data) {
    const res = await axios.put(`${API}/api/admin/users/${id}`, data, config());
    return res.data;
}

export async function toggleUserStatus(id) {
    const res = await axios.patch(`${API}/api/admin/users/${id}/toggle-status`, {}, config());
    return res.data;
}

export async function deleteUser(id) {
    const res = await axios.delete(`${API}/api/admin/users/${id}`, config());
    return res.data;
}

export async function resetUserPassword(id, new_password) {
    const res = await axios.post(`${API}/api/admin/users/${id}/reset-password`, { new_password }, config());
    return res.data;
}

export async function changeUserRole(id, role_name) {
    const res = await axios.patch(`${API}/api/admin/users/${id}/change-role`, { role_name }, config());
    return res.data;
}

export async function getUserTransactions(id) {
    const res = await axios.get(`${API}/api/admin/users/${id}/transactions`, config());
    return res.data;
}

export async function getUserMessages(id) {
    const res = await axios.get(`${API}/api/admin/users/${id}/messages`, config());
    return res.data;
}

export async function getUserDeliveries(id) {
    const res = await axios.get(`${API}/api/admin/users/${id}/deliveries`, config());
    return res.data;
}

export async function getCatalogBooks(params) {
    const res = await axios.get(`${API}/api/admin/books/catalog`, { ...config(), params });
    return res.data;
}

export async function getCatalogBook(id) {
    const res = await axios.get(`${API}/api/admin/books/catalog/${id}`, config());
    return res.data;
}

export async function createCatalogBook(data) {
    const res = await axios.post(`${API}/api/admin/books/catalog`, data, config());
    return res.data;
}

export async function updateCatalogBook(id, data) {
    const res = await axios.put(`${API}/api/admin/books/catalog/${id}`, data, config());
    return res.data;
}

export async function deleteCatalogBook(id) {
    const res = await axios.delete(`${API}/api/admin/books/catalog/${id}`, config());
    return res.data;
}

export async function toggleBookActive(id) {
    const res = await axios.patch(`${API}/api/admin/books/catalog/${id}/toggle-active`, {}, config());
    return res.data;
}

export async function getBookStats(id) {
    const res = await axios.get(`${API}/api/admin/books/catalog/${id}/stats`, config());
    return res.data;
}

export async function getUserBooks(params) {
    const res = await axios.get(`${API}/api/admin/books/user-books`, { ...config(), params });
    return res.data;
}

export async function updateUserBook(id, data) {
    const res = await axios.put(`${API}/api/admin/books/user-books/${id}`, data, config());
    return res.data;
}

export async function deleteUserBook(id) {
    const res = await axios.delete(`${API}/api/admin/books/user-books/${id}`, config());
    return res.data;
}

export async function getInventory(params) {
    const res = await axios.get(`${API}/api/admin/books/inventory`, { ...config(), params });
    return res.data;
}

export async function createInventoryItem(data) {
    const res = await axios.post(`${API}/api/admin/books/inventory`, data, config());
    return res.data;
}

export async function updateInventoryItem(id, data) {
    const res = await axios.put(`${API}/api/admin/books/inventory/${id}`, data, config());
    return res.data;
}

export async function deleteInventoryItem(id) {
    const res = await axios.delete(`${API}/api/admin/books/inventory/${id}`, config());
    return res.data;
}

export async function getBookOrders(params) {
    const res = await axios.get(`${API}/api/admin/orders/book-orders`, { ...config(), params });
    return res.data;
}

export async function getUserCommandes(params) {
    const res = await axios.get(`${API}/api/admin/orders/user-commandes`, { ...config(), params });
    return res.data;
}

export async function getOrder(id) {
    const res = await axios.get(`${API}/api/admin/orders/book-orders/${id}`, config());
    return res.data;
}

export async function updateOrderStatus(id, status) {
    const res = await axios.patch(`${API}/api/admin/orders/book-orders/${id}/status`, { status }, config());
    return res.data;
}

export async function cancelOrder(id) {
    const res = await axios.post(`${API}/api/admin/orders/book-orders/${id}/cancel`, {}, config());
    return res.data;
}

export async function getExchanges(params) {
    const res = await axios.get(`${API}/api/admin/orders/exchanges`, { ...config(), params });
    return res.data;
}

export async function getExchange(id) {
    const res = await axios.get(`${API}/api/admin/orders/exchanges/${id}`, config());
    return res.data;
}

export async function updateExchangeStatus(id, status) {
    const res = await axios.patch(`${API}/api/admin/orders/exchanges/${id}/status`, { status }, config());
    return res.data;
}

export async function getDeliveries(params) {
    const res = await axios.get(`${API}/api/admin/orders/deliveries`, { ...config(), params });
    return res.data;
}

export async function getDeliveryPersons() {
    const res = await axios.get(`${API}/api/admin/orders/delivery-persons`, config());
    return res.data;
}

export async function getWalletOverview() {
    const res = await axios.get(`${API}/api/admin/wallets/overview`, config());
    return res.data;
}

export async function getWalletTransactions(params) {
    const res = await axios.get(`${API}/api/admin/wallets/transactions`, { ...config(), params });
    return res.data;
}

export async function getWallets(params) {
    const res = await axios.get(`${API}/api/admin/wallets/wallets`, { ...config(), params });
    return res.data;
}

export async function getPayments(params) {
    const res = await axios.get(`${API}/api/admin/wallets/payments`, { ...config(), params });
    return res.data;
}

export async function approvePayment(id) {
    const res = await axios.post(`${API}/api/admin/wallets/payments/${id}/approve`, {}, config());
    return res.data;
}

export async function rejectPayment(id, reason) {
    const res = await axios.post(`${API}/api/admin/wallets/payments/${id}/reject`, { reason }, config());
    return res.data;
}

export async function adjustWalletBalance(id, amount, reason) {
    const res = await axios.post(`${API}/api/admin/wallets/wallets/${id}/adjust`, { amount, reason }, config());
    return res.data;
}

export async function sendAdminMessage(data) {
    const res = await axios.post(`${API}/api/admin/messages`, data, config());
    return res.data;
}

export async function getSentMessages(params) {
    const res = await axios.get(`${API}/api/admin/messages`, { ...config(), params });
    return res.data;
}

export async function getLogs(params) {
    const res = await axios.get(`${API}/api/admin/logs`, { ...config(), params });
    return res.data;
}

export async function getSettings() {
    const res = await axios.get(`${API}/api/admin/settings`, config());
    return res.data;
}

export async function saveSetting(key, value) {
    const res = await axios.post(`${API}/api/admin/settings`, { key, value }, config());
    return res.data;
}

export async function getDefaultSettings() {
    const res = await axios.get(`${API}/api/admin/settings/defaults`, config());
    return res.data;
}

export async function globalSearch(q) {
    const res = await axios.get(`${API}/api/admin/search`, { ...config(), params: { q } });
    return res.data;
}

export async function getStatistics(params) {
    const res = await axios.get(`${API}/api/admin/statistics`, { ...config(), params });
    return res.data;
}

export async function getBackup() {
    const res = await axios.get(`${API}/api/admin/backup`, config());
    return res.data;
}

