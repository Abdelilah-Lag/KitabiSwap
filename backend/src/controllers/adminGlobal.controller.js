import {
    sendAdminMessage,
    getSentMessages,
    getLogs,
    getSettings,
    updateSetting,
    getDefaultSettings,
    globalSearch,
    getDetailedStats,
    getBackupData
} from "../services/adminGlobal.service.js";
import { createLog } from "../services/adminGlobal.service.js";

// ==========================================
// MESSAGES
// ==========================================

export async function sendMessage(req, res) {
    try {
        const result = await sendAdminMessage(req.body, req.user.id);
        await createLog(req.user.id, "send_broadcast", "admin_messages", result.id, `Message envoyé: ${req.body.title}`, req.ip);
        res.json({ success: true, message: "Message envoyé avec succès", data: result });
    } catch (error) {
        console.error("[AdminMessages] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function listSentMessages(req, res) {
    try {
        const { page, limit } = req.query;
        const data = await getSentMessages({ page: Number(page) || 1, limit: Number(limit) || 20, adminId: req.user.id });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminMessages] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// ==========================================
// LOGS
// ==========================================

export async function listLogs(req, res) {
    try {
        const { page, limit, action, entity_type, admin_id, search, sort, order } = req.query;
        const data = await getLogs({
            page: Number(page) || 1, limit: Number(limit) || 50,
            action, entity_type, admin_id, search, sort, order
        });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminLogs] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// ==========================================
// SETTINGS
// ==========================================

export async function getPlatformSettings(req, res) {
    try {
        const settings = await getSettings();
        res.json({ success: true, settings });
    } catch (error) {
        console.error("[AdminSettings] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function saveSetting(req, res) {
    try {
        const { key, value } = req.body;
        if (!key || value === undefined) {
            return res.status(400).json({ success: false, message: "Clé et valeur requises" });
        }
        const setting = await updateSetting(key, value);
        await createLog(req.user.id, "update_setting", "admin_settings", key, `Paramètre modifié: ${key} = ${value}`, req.ip);
        res.json({ success: true, setting });
    } catch (error) {
        console.error("[AdminSettings] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

export async function getDefaultPlatformSettings(req, res) {
    try {
        const defaults = await getDefaultSettings();
        res.json({ success: true, defaults });
    } catch (error) {
        console.error("[AdminSettings] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// ==========================================
// GLOBAL SEARCH
// ==========================================

export async function search(req, res) {
    try {
        const { q } = req.query;
        if (!q || q.length < 2) {
            return res.json({ success: true, results: {}, total: 0 });
        }
        const data = await globalSearch(q);
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminSearch] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// ==========================================
// STATISTICS
// ==========================================

export async function getStatistics(req, res) {
    try {
        const { period, start_date, end_date } = req.query;
        const data = await getDetailedStats({ period, start_date, end_date });
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminStats] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

// ==========================================
// BACKUP
// ==========================================

export async function exportBackup(req, res) {
    try {
        const data = await getBackupData();
        res.json({ success: true, ...data });
    } catch (error) {
        console.error("[AdminBackup] Error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
}

