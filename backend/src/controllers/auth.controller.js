import authService from "../services/auth.service.js";

/**
 * ==============================
 * Login
 * POST /api/auth/login
 * ==============================
 */
export async function login(req, res) {
    try {

        const { email, password } = req.body;

        // Validation des champs
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email et mot de passe sont obligatoires."
            });
        }

        const result = await authService.login(email, password);

        return res.status(200).json({
            success: true,
            message: "Connexion réussie.",
            token: result.token,
            user: result.user
        });

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: error.message || "Email ou mot de passe incorrect."
        });

    }
}

/**
 * ==============================
 * Register
 * POST /api/auth/register
 * ==============================
 */
export async function register(req, res) {

    try {

        const {
            first_name,
            last_name,
            email,
            phone,
            password
        } = req.body;

        // Validation des champs obligatoires
        if (
            !first_name ||
            !last_name ||
            !email ||
            !phone ||
            !password
        ) {

            return res.status(400).json({
                success: false,
                message: "Tous les champs sont obligatoires."
            });

        }

        // Validation du mot de passe
        if (password.length < 8) {

            return res.status(400).json({
                success: false,
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });

        }

        const result = await authService.register({

            first_name,
            last_name,
            email,
            phone,
            password

        });

        return res.status(201).json(result);

    } catch (error) {

        return res.status(400).json({

            success: false,

            message: error.message || "Impossible de créer le compte."

        });

    }

}
/**
 * ==============================
 * Vérification du token
 * GET /api/auth/me
 * ==============================
 */
async function me(req, res) {

    try {

        return res.status(200).json({
            success: true,
            user: req.user
        });

    } catch (error) {

        return res.status(500).json({
            success: false,
            message: "Impossible de récupérer l'utilisateur."
        });

    }

}

/**
 * ==============================
 * Logout
 * ==============================
 *
 * Avec JWT il n'y a pas de session
 * serveur à détruire.
 * Le frontend supprimera simplement
 * le token du localStorage.
 */
async function logout(req, res) {

    return res.status(200).json({
        success: true,
        message: "Déconnexion réussie."
    });

}

/**
 * ==============================
 * Mot de passe oublié (envoi du code)
 * POST /api/auth/forgot-password
 * ==============================
 */
async function forgotPassword(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "L'email est obligatoire."
            });
        }

        const result = await authService.forgotPassword(email);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Une erreur est survenue."
        });
    }
}

/**
 * ==============================
 * Vérification du code de réinitialisation
 * POST /api/auth/verify-reset-code
 * ==============================
 */
async function verifyResetCode(req, res) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "Email et code sont obligatoires."
            });
        }

        const result = await authService.verifyResetCode(email, code);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Code invalide."
        });
    }
}

/**
 * ==============================
 * Réinitialisation du mot de passe
 * POST /api/auth/reset-password
 * ==============================
 */
async function resetPassword(req, res) {
    try {
        const { email, code, password } = req.body;

        if (!email || !code || !password) {
            return res.status(400).json({
                success: false,
                message: "Email, code et nouveau mot de passe sont obligatoires."
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Le mot de passe doit contenir au moins 8 caractères."
            });
        }

        const result = await authService.resetPassword(email, code, password);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Impossible de réinitialiser le mot de passe."
        });
    }
}

/**
 * ==============================
 * Envoi du code de vérification d'email
 * POST /api/auth/send-verification
 * ==============================
 */
async function sendEmailVerification(req, res) {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "L'email est obligatoire."
            });
        }

        const result = await authService.sendEmailVerification(email);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Une erreur est survenue."
        });
    }
}

/**
 * ==============================
 * Vérification de l'email avec le code
 * POST /api/auth/verify-email
 * ==============================
 */
async function verifyEmail(req, res) {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                success: false,
                message: "Email et code sont obligatoires."
            });
        }

        const result = await authService.verifyEmail(email, code);

        return res.status(200).json(result);

    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || "Code invalide."
        });
    }
}

export {
    me,
    logout,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    sendEmailVerification,
    verifyEmail
};
