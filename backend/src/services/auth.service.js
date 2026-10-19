import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { randomUUID, randomInt } from "crypto";
import prisma from "../config/prisma.js";
import { sendResetCodeEmail, sendVerificationCodeEmail } from "../config/email.js";

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

/**
 * Authentification utilisateur
 */
async function login(email, password) {

    // Recherche de l'utilisateur avec son rôle
    const user = await prisma.users.findUnique({
        where: {
            email: email.toLowerCase().trim()
        },
        include: {
            roles: true
        }
    });

    if (!user) {
        throw new Error("Email ou mot de passe incorrect.");
    }

    // Vérifie si l'email est vérifié
    if (!user.email_verified) {
        throw new Error("Veuillez vérifier votre adresse email avant de vous connecter.");
    }

    // Vérifie le statut du compte
    if (
        user.status &&
        ["suspendu", "suspended"].includes(user.status.toLowerCase())
    ) {
        throw new Error("Votre compte est désactivé.");
    }

    // Vérification du mot de passe
    const passwordMatch = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!passwordMatch) {
        throw new Error("Email ou mot de passe incorrect.");
    }

    // Mise à jour de la dernière connexion
    await prisma.users.update({
        where: {
            id: user.id
        },
        data: {
            last_login: new Date()
        }
    });

    // Création du token
    const token = jwt.sign(
        {
            id: Number(user.id),
            email: user.email,
            role: user.roles.name
        },
        JWT_SECRET,
        {
            expiresIn: JWT_EXPIRES_IN
        }
    );

    // Données renvoyées au frontend
    return {
        token,
        user: {
            id: Number(user.id),
            first_name: user.first_name,
            last_name: user.last_name,
            name: user.full_name,
            email: user.email,
            role: user.roles.name,
            avatar: user.avatar_url,
            avatar_url: user.avatar_url,
            status: user.status
        }
    };
}

/**
 * Vérifie un token JWT
 */
function verifyToken(token) {
    return jwt.verify(token, JWT_SECRET);
}
/**
 * ==========================================
 * Inscription utilisateur
 * ==========================================
 */
async function register(data) {

    const {
        first_name,
        last_name,
        email,
        phone,
        password
    } = data;

    // Vérifie si l'email existe déjà
    const existingEmail = await prisma.users.findUnique({
        where: {
            email: email.toLowerCase().trim()
        }
    });

    if (existingEmail) {
        throw new Error("Cet email est déjà utilisé.");
    }

    // Vérifie si le téléphone existe déjà
    const existingPhone = await prisma.users.findFirst({
        where: {
            phone: phone.trim()
        }
    });

    if (existingPhone) {
        throw new Error("Ce numéro de téléphone est déjà utilisé.");
    }

    // Recherche du rôle USER
    const userRole = await prisma.roles.findFirst({
        where: {
            name: "user"
        }
    });

    if (!userRole) {
        throw new Error("Le rôle 'user' est introuvable.");
    }

    // Hash du mot de passe
    const passwordHash = await bcrypt.hash(password, 10);

    // Création de l'utilisateur
    const newUser = await prisma.users.create({

        data: {

            uuid: randomUUID(),

            first_name,

            last_name,

            email: email.toLowerCase().trim(),

            phone,

            password_hash: passwordHash,

            role_id: userRole.id,

            email_verified: false,

            phone_verified: false,

            status: "pending",

            avatar_public_id: null,

            avatar_url: null,

            created_at: new Date()

        }

    });

    // Générer un code de vérification d'email
    const code = String(randomInt(100000, 999999));

    // Invalider les anciens codes
    await prisma.email_verification_codes.updateMany({
        where: {
            user_id: newUser.id,
            used: false
        },
        data: {
            used: true
        }
    });

    // Stocker le code (expire dans 15 minutes)
    await prisma.email_verification_codes.create({
        data: {
            user_id: newUser.id,
            email: newUser.email,
            code,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
            used: false
        }
    });

    // Envoyer l'email de vérification
    await sendVerificationCodeEmail(newUser.email, code);

    return {

        success: true,

        message: "Votre compte a été créé avec succès. Veuillez vérifier votre adresse email.",

        user: {

            id: Number(newUser.id),

            first_name: newUser.first_name,

            last_name: newUser.last_name,

            email: newUser.email

        }

    };

}

/**
 * ==========================================
 * Demande de réinitialisation de mot de passe
 * ==========================================
 */
async function forgotPassword(email) {
    const user = await prisma.users.findUnique({
        where: {
            email: email.toLowerCase().trim()
        }
    });

    if (!user) {
        // On ne révèle pas si l'email existe pour des raisons de sécurité
        return { success: true, message: "Si cet email existe, un code de vérification vous a été envoyé." };
    }

    // Invalidate les anciens codes
    await prisma.password_reset_codes.updateMany({
        where: {
            user_id: user.id,
            used: false
        },
        data: {
            used: true
        }
    });

    // Générer un code à 6 chiffres
    const code = String(randomInt(100000, 999999));

    // Stocker le code (expire dans 15 minutes)
    await prisma.password_reset_codes.create({
        data: {
            user_id: user.id,
            email: user.email,
            code,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
            used: false
        }
    });

    // Envoyer l'email
    await sendResetCodeEmail(user.email, code);

    return {
        success: true,
        message: "Si cet email existe, un code de vérification vous a été envoyé."
    };
}

/**
 * ==========================================
 * Vérification du code de réinitialisation
 * ==========================================
 */
async function verifyResetCode(email, code) {
    const resetRecord = await prisma.password_reset_codes.findFirst({
        where: {
            email: email.toLowerCase().trim(),
            code,
            used: false,
            expires_at: {
                gt: new Date()
            }
        }
    });

    if (!resetRecord) {
        throw new Error("Code invalide ou expiré.");
    }

    return {
        success: true,
        message: "Code vérifié avec succès."
    };
}

/**
 * ==========================================
 * Réinitialisation du mot de passe
 * ==========================================
 */
async function resetPassword(email, code, newPassword) {
    const resetRecord = await prisma.password_reset_codes.findFirst({
        where: {
            email: email.toLowerCase().trim(),
            code,
            used: false,
            expires_at: {
                gt: new Date()
            }
        }
    });

    if (!resetRecord) {
        throw new Error("Code invalide ou expiré.");
    }

    // Hasher le nouveau mot de passe
    const passwordHash = await bcrypt.hash(newPassword, 10);

    // Mettre à jour le mot de passe et marquer le code comme utilisé (transaction)
    await prisma.$transaction([
        prisma.users.update({
            where: { id: resetRecord.user_id },
            data: { password_hash: passwordHash }
        }),
        prisma.password_reset_codes.update({
            where: { id: resetRecord.id },
            data: { used: true }
        })
    ]);

    return {
        success: true,
        message: "Votre mot de passe a été réinitialisé avec succès."
    };
}

/**
 * ==========================================
 * Envoi d'un code de vérification d'email
 * ==========================================
 */
async function sendEmailVerification(email) {
    const user = await prisma.users.findUnique({
        where: {
            email: email.toLowerCase().trim()
        }
    });

    if (!user) {
        throw new Error("Utilisateur introuvable.");
    }

    if (user.email_verified) {
        throw new Error("Votre email est déjà vérifié.");
    }

    // Invalider les anciens codes
    await prisma.email_verification_codes.updateMany({
        where: {
            user_id: user.id,
            used: false
        },
        data: {
            used: true
        }
    });

    // Générer un code à 6 chiffres
    const code = String(randomInt(100000, 999999));

    // Stocker le code (expire dans 15 minutes)
    await prisma.email_verification_codes.create({
        data: {
            user_id: user.id,
            email: user.email,
            code,
            expires_at: new Date(Date.now() + 15 * 60 * 1000),
            used: false
        }
    });

    // Envoyer l'email
    await sendVerificationCodeEmail(user.email, code);

    return {
        success: true,
        message: "Un nouveau code de vérification vous a été envoyé."
    };
}

/**
 * ==========================================
 * Vérification de l'email avec le code
 * ==========================================
 */
async function verifyEmail(email, code) {
    const verificationRecord = await prisma.email_verification_codes.findFirst({
        where: {
            email: email.toLowerCase().trim(),
            code,
            used: false,
            expires_at: {
                gt: new Date()
            }
        }
    });

    if (!verificationRecord) {
        throw new Error("Code invalide ou expiré.");
    }

    // Marquer le code comme utilisé et activer l'utilisateur (transaction)
    await prisma.$transaction([
        prisma.users.update({
            where: { id: verificationRecord.user_id },
            data: {
                email_verified: true,
                phone_verified: true,
                status: "active"
            }
        }),
        prisma.email_verification_codes.update({
            where: { id: verificationRecord.id },
            data: { used: true }
        })
    ]);

    return {
        success: true,
        message: "Votre adresse email a été vérifiée avec succès."
    };
}

export default {
    login,
    register,
    verifyToken,
    forgotPassword,
    verifyResetCode,
    resetPassword,
    sendEmailVerification,
    verifyEmail
};
