import express from "express";
import { authenticate, authorize } from "../middleware/auth.middleware.js";
import {
    listUsers,
    getUser,
    editUser,
    toggleStatus,
    removeUser,
    resetPassword,
    changeRole,
    listUserTransactions,
    listUserMessages,
    listUserDeliveries
} from "../controllers/adminUser.controller.js";

const router = express.Router();

router.use(authenticate, authorize("admin"));

router.get("/", listUsers);
router.get("/:id", getUser);
router.put("/:id", editUser);
router.patch("/:id/toggle-status", toggleStatus);
router.delete("/:id", removeUser);
router.post("/:id/reset-password", resetPassword);
router.patch("/:id/change-role", changeRole);
router.get("/:id/transactions", listUserTransactions);
router.get("/:id/messages", listUserMessages);
router.get("/:id/deliveries", listUserDeliveries);

export default router;

