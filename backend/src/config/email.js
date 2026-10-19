import nodemailer from "nodemailer";

// Vérifier si SMTP est configuré
const smtpConfigured = process.env.SMTP_USER && process.env.SMTP_PASS;

let transporter = null;

if (smtpConfigured) {
    transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    console.log("✅ SMTP configuré - Les emails peuvent être envoyés");
} else {
    console.log("⚠️  SMTP non configuré - Les emails ne seront pas envoyés (mode développement)");
}

/**
 * Envoie un email avec le code de vérification d'email
 */
export async function sendVerificationCodeEmail(email, code) {

    // Si SMTP n'est pas configuré, on ne tente pas l'envoi
    if (!smtpConfigured || !transporter) {
        console.log("📧 Email NON envoyé (SMTP non configuré)");
        console.log(`📧 Destinataire: ${email}`);
        console.log(`📧 Code: ${code}`);
        return false;
    }

    const appName = "KitabiSwap";

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <div style="text-align: center; padding: 20px 0;">
                <h1 style="color: #2563eb; margin: 0;">${appName}</h1>
            </div>
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Vérification de votre adresse email</h2>
                <p style="color: #666; line-height: 1.6;">Bonjour,</p>
                <p style="color: #666; line-height: 1.6;">
                    Merci de vous être inscrit sur ${appName}. 
                    Veuillez utiliser le code ci-dessous pour vérifier votre adresse email :
                </p>
                <div style="text-align: center; padding: 25px 0;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 10px; font-family: 'Courier New', monospace;">
                        ${code}
                    </div>
                </div>
                <p style="color: #666; line-height: 1.6;">
                    Ce code expire dans <strong>15 minutes</strong>. 
                    Si vous n'avez pas créé de compte, ignorez cet email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
                <p style="color: #999; font-size: 12px; text-align: center;">
                    Cet email a été envoyé automatiquement. Merci de ne pas y répondre.<br />
                    &copy; ${new Date().getFullYear()} ${appName}. Tous droits réservés.
                </p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"${appName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: "Vérification de votre adresse email - KitabiSwap",
            html
        });
        console.log(`✅ Email de vérification envoyé avec succès à ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Erreur d'envoi d'email:", error.message);
        return false;
    }
}

/**
 * Envoie un email avec le code de réinitialisation
 */
export async function sendResetCodeEmail(email, code) {

    // Si SMTP n'est pas configuré, on ne tente pas l'envoi
    if (!smtpConfigured || !transporter) {
        console.log("📧 Email NON envoyé (SMTP non configuré)");
        console.log(`📧 Destinataire: ${email}`);
        console.log(`📧 Code: ${code}`);
        return false;
    }

    const appName = "KitabiSwap";

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <div style="text-align: center; padding: 20px 0;">
                <h1 style="color: #2563eb; margin: 0;">${appName}</h1>
            </div>
            <div style="background-color: #ffffff; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; margin-top: 0;">Réinitialisation de mot de passe</h2>
                <p style="color: #666; line-height: 1.6;">Bonjour,</p>
                <p style="color: #666; line-height: 1.6;">
                    Vous avez demandé la réinitialisation de votre mot de passe. 
                    Voici votre code de vérification :
                </p>
                <div style="text-align: center; padding: 25px 0;">
                    <div style="display: inline-block; background: linear-gradient(135deg, #2563eb, #1d4ed8); color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 15px 30px; border-radius: 10px; font-family: 'Courier New', monospace;">
                        ${code}
                    </div>
                </div>
                <p style="color: #666; line-height: 1.6;">
                    Ce code expire dans <strong>15 minutes</strong>. 
                    Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.
                </p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 25px 0;" />
                <p style="color: #999; font-size: 12px; text-align: center;">
                    Cet email a été envoyé automatiquement. Merci de ne pas y répondre.<br />
                    &copy; ${new Date().getFullYear()} ${appName}. Tous droits réservés.
                </p>
            </div>
        </div>
    `;

    try {
        await transporter.sendMail({
            from: `"${appName}" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
            to: email,
            subject: "Réinitialisation de votre mot de passe - KitabiSwap",
            html
        });
        console.log(`✅ Email envoyé avec succès à ${email}`);
        return true;
    } catch (error) {
        console.error("❌ Erreur d'envoi d'email:", error.message);
        return false;
    }
}

