import {
    getDashboardService
} from "../services/controllerDashboard.service.js";

export async function getDashboard(req, res) {

    try {
        const data = await getDashboardService();
        res.json(data);
    }
    catch (error) {
        console.error(error);
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
}

