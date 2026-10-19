import { getUserDashboard } from "../services/user.service.js";

export async function getDashboard(req, res) {

    try {

        const userId = req.user.id;

        const dashboard = await getUserDashboard(userId);

        res.json(dashboard);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            success: false,

            message: "Internal Server Error"

        });

    }

}