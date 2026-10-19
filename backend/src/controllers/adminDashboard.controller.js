import { getDashboardStats } from "../services/adminDashboard.service.js";

export async function getDashboard(req, res) {
    try {
        const data = await getDashboardStats();
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminDashboard] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

