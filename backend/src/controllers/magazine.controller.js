import { getMagazineBooks } from "../services/magazine.service.js";

export async function magazineBooks(req, res) {

    try {

        const data = await getMagazineBooks(req.query);

        res.status(200).json(data);

    }

    catch (error) {

        console.error("Magazine Error:", error);

        res.status(500).json({

            message: "Internal Server Error"

        });

    }

}