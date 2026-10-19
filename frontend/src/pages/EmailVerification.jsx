import "./EmailVerification.css";

import axios from "axios";

import { useState, useEffect } from "react";

import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { useTranslation } from "react-i18next";

import {
    FaArrowLeft,
    FaEnvelope,
    FaCheckCircle,
    FaSpinner
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/auth";

export default function EmailVerification() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [searchParams] = useSearchParams();

    const emailParam = searchParams.get("email") || "";

    const [email, setEmail] = useState(emailParam);

    const [code, setCode] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    const [verified, setVerified] = useState(false);

    const [resendLoading, setResendLoading] = useState(false);

    /**
     * Vérifier le code
     */
    async function handleVerify(e) {

        e.preventDefault();

        setError("");

        setSuccess("");

        setLoading(true);

        try {

            const res = await axios.post(

                `${API_URL}/verify-email`,

                { email, code }

            );

            setSuccess(res.data.message);

            setVerified(true);

            setTimeout(() => navigate("/login"), 2000);

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Code invalide."

            );

        } finally {

            setLoading(false);

        }

    }

    /**
     * Renvoyer le code
     */
    async function handleResend() {

        setError("");

        setSuccess("");

        setResendLoading(true);

        try {

            const res = await axios.post(

                `${API_URL}/send-verification`,

                { email }

            );

            setSuccess(res.data.message);

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Une erreur est survenue."

            );

        } finally {

            setResendLoading(false);

        }

    }

    /**
     * Gère l'input du code (max 6 chiffres)
     */
    function handleCodeChange(e) {

        const value = e.target.value.replace(/\D/g, "").slice(0, 6);

        setCode(value);

    }

    return (

        <div className="email-verification-page">

            {/* Back Home */}
            <Link
                to="/login"
                className="back-home"
            >
                <FaArrowLeft />
                {t("back_home") || "Back to Login"}
            </Link>

            <div className="email-verification-container">

                {/* Header */}
                <div className="email-verification-header">
                    <h1>KitabiSwap</h1>

                    <h2>
                        {verified
                            ? (t("email_verified") || "Email vérifié")
                            : (t("verify_email") || "Vérification de l'email")
                        }
                    </h2>

                    <p>
                        {verified
                            ? (t("email_verified_desc") || "Votre email a été vérifié avec succès. Vous allez être redirigé.")
                            : (t("email_verification_desc") || "Un code de vérification à 6 chiffres vous a été envoyé par email.")
                        }
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="email-verification-error">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && !verified && (
                    <div className="email-verification-success">
                        <FaCheckCircle />
                        <span>{success}</span>
                    </div>
                )}

                {verified ? (

                    <div className="email-verification-success verified-screen">
                        <FaCheckCircle className="verified-icon" />
                        <h3>{t("email_verified_success") || "Votre adresse email a été vérifiée !"}</h3>
                        <p>{t("redirecting") || "Redirection vers la page de connexion..."}</p>
                    </div>

                ) : (

                    <form
                        onSubmit={handleVerify}
                        className="email-verification-form"
                    >

                        {/* Email (readonly si déjà fourni) */}
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder={t("email") || "Email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                readOnly={!!emailParam}
                            />
                        </div>

                        {/* Code */}
                        <div className="code-input-group">
                            <input
                                type="text"
                                inputMode="numeric"
                                placeholder="000000"
                                value={code}
                                onChange={handleCodeChange}
                                maxLength={6}
                                className="code-input"
                                required
                                autoFocus
                            />
                        </div>

                        <button
                            type="submit"
                            className="email-verification-button"
                            disabled={loading || code.length !== 6 || !email}
                        >
                            {loading ? (
                                <><FaSpinner className="spinner" /> {t("verifying") || "Vérification..."}</>
                            ) : (
                                <>{t("verify") || "Vérifier"}</>
                            )}
                        </button>

                        <button
                            type="button"
                            className="email-verification-resend"
                            onClick={handleResend}
                            disabled={resendLoading || !email}
                        >
                            {resendLoading ? (
                                <><FaSpinner className="spinner" /> {t("resending") || "Renvoi..."}</>
                            ) : (
                                <>{t("resend_code") || "Renvoyer le code"}</>
                            )}
                        </button>

                    </form>

                )}

                {/* Footer */}
                <div className="email-verification-footer">
                    <p>
                        {t("already_have_account") || "Vous avez déjà un compte ?"}
                    </p>
                    <Link to="/login">
                        {t("login") || "Connexion"}
                    </Link>
                </div>

            </div>

        </div>

    );

}

