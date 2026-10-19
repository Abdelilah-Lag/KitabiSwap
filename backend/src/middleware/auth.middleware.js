import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET;

/**
 * ==========================================
 * Vérifie le JWT
 * ==========================================
 */
function authenticate(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (!authHeader) {
            return res.status(401).json({
                success: false,
                message: "Token manquant."
            });
        }

        if (!authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "Format du token invalide."
            });
        }

        const token = authHeader.split(" ")[1];

        const decoded = jwt.verify(token, JWT_SECRET);

        req.user = decoded;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Token invalide ou expiré."
        });

    }

}

/**
 * ==========================================
 * Vérification des rôles
 * ==========================================
 *
 * Exemple :
 *
 * authorize("admin")
 *
 * authorize("admin","controller")
 *
 */
function authorize(...roles) {

    return (req, res, next) => {

        if (!req.user) {

            return res.status(401).json({
                success: false,
                message: "Utilisateur non authentifié."
            });

        }

        if (!roles.includes(req.user.role)) {

            return res.status(403).json({
                success: false,
                message: "Accès refusé."
            });

        }

        next();

    };

}

/**
 * ==========================================
 * Middleware facultatif
 * Permet d'obtenir l'utilisateur si un token
 * est présent sans rendre l'authentification
 * obligatoire.
 * ==========================================
 */
function optionalAuth(req, res, next) {

    try {

        const authHeader = req.headers.authorization;

        if (
            authHeader &&
            authHeader.startsWith("Bearer ")
        ) {

            const token = authHeader.split(" ")[1];

            req.user = jwt.verify(token, JWT_SECRET);

        }

    } catch (error) {

        req.user = null;

    }

    next();

}

export {
    authenticate,
    authorize,
    optionalAuth
};