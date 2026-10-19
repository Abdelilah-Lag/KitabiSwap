import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    sendMessage,
    listSentMessages,
    listLogs,
    getPlatformSettings,
    saveSetting,
    getDefaultPlatformSettings,
    search,
    getStatistics,
    exportBackup
} from "../controllers/adminGlobal.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

// Messages
router.post("/messages", sendMessage);
router.get("/messages", listSentMessages);

// Logs
router.get("/logs", listLogs);

// Settings
router.get("/settings", getPlatformSettings);
router.post("/settings", saveSetting);
router.get("/settings/defaults", getDefaultPlatformSettings);

// Global Search
router.get("/search", search);

// Statistics
router.get("/statistics", getStatistics);

// Backup
router.get("/backup", exportBackup);

export default router;

