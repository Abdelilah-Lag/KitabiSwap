import express from "express";
import * as authController from "../controllers/auth.controller.js";
import * as authMiddleware from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * ==============================
 * Auth Routes
 * Base URL : /api/auth
 * ==============================
 */

// Connexion
router.post("/login", authController.login);

// Déconnexion
router.post("/logout", authMiddleware.authenticate, authController.logout);

// Informations de l'utilisateur connecté
router.get("/me", authMiddleware.authenticate, authController.me);

router.post("/register", authController.register);

// Vérification d'email
router.post("/send-verification", authController.sendEmailVerification);
router.post("/verify-email", authController.verifyEmail);

// Mot de passe oublié
router.post("/forgot-password", authController.forgotPassword);
router.post("/verify-reset-code", authController.verifyResetCode);
router.post("/reset-password", authController.resetPassword);

export default router;
