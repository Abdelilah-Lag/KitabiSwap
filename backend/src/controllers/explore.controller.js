import { getExploreBooks } from "../services/explore.service.js";

export async function exploreBooks(req, res) {

    try {

        const data = await getExploreBooks(req.query);

        res.status(200).json(data);

    }

    catch (error) {

        console.error("Explore Error :", error);

        res.status(500).json({

            message: "Internal Server Error"

        });

    }

}