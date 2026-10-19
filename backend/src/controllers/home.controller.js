import { getHomePageData } from "../services/home.service.js";

export async function getHomeData(req, res) {

    try {

        const data = await getHomePageData();

        res.json(data);

    }

    catch (error) {

        console.error(error);

        res.status(500).json({

            message: "Internal server error"

        });

    }

}