import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import prisma from "./config/prisma.js";

const PORT = process.env.PORT || 5000;

async function startServer() {

    try {

        await prisma.$connect();

        console.log("✅ MySQL connecté avec Prisma");

        app.listen(PORT, () => {

            console.log(`🚀 KitabiSwap Backend démarré`);
            console.log(`🌐 http://localhost:${PORT}`);

        });

    }

    catch (error) {

        console.error("❌ Erreur de connexion :", error);

        process.exit(1);

    }

}

startServer();