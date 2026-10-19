import {
    getUsers,
    getUserById,
    updateUser,
    toggleUserStatus,
    deleteUser,
    resetUserPassword,
    changeUserRole,
    getUserTransactions,
    getUserMessages,
    getUserDeliveries
} from "../services/adminUser.service.js";

export async function listUsers(req, res) {
    try {
        const { page, limit, search, role, status, city, sort, order } = req.query;
        const data = await getUsers({ page: Number(page) || 1, limit: Number(limit) || 20, search, role, status, city, sort, order });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getUser(req, res) {
    try {
        const user = await getUserById(req.params.id);
        if (!user) return res.status(404).json({ success: false, message: "Utilisateur introuvable" });
        res.json({ success: true, user });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function editUser(req, res) {
    try {
        const user = await updateUser(req.params.id, req.body);
        res.json({ success: true, user });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function toggleStatus(req, res) {
    try {
        const user = await toggleUserStatus(req.params.id);
        res.json({ success: true, user, message: user.status === "suspended" ? "Utilisateur bloqué" : "Utilisateur débloqué" });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function removeUser(req, res) {
    try {
        await deleteUser(req.params.id);
        res.json({ success: true, message: "Utilisateur supprimé" });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function resetPassword(req, res) {
    try {
        const { new_password } = req.body;
        if (!new_password || new_password.length < 8) {
            return res.status(400).json({ success: false, message: "Le mot de passe doit contenir au moins 8 caractères" });
        }
        await resetUserPassword(req.params.id, new_password);
        res.json({ success: true, message: "Mot de passe réinitialisé" });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function changeRole(req, res) {
    try {
        const { role_name } = req.body;
        if (!role_name) return res.status(400).json({ success: false, message: "Rôle requis" });
        await changeUserRole(req.params.id, role_name);
        res.json({ success: true, message: "Rôle changé avec succès" });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listUserTransactions(req, res) {
    try {
        const transactions = await getUserTransactions(req.params.id);
        res.json({ success: true, transactions });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listUserMessages(req, res) {
    try {
        const messages = await getUserMessages(req.params.id);
        res.json({ success: true, messages });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listUserDeliveries(req, res) {
    try {
        const deliveries = await getUserDeliveries(req.params.id);
        res.json({ success: true, deliveries });
    } catch (error) {
        console.error("[AdminUsers] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

