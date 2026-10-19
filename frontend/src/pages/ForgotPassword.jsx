import "./ForgotPassword.css";

import axios from "axios";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import {
    FaArrowLeft,
    FaEnvelope,
    FaLock,
    FaKey,
    FaCheckCircle,
    FaSpinner
} from "react-icons/fa";

const API_URL = "http://localhost:5000/api/auth";

export default function ForgotPassword() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    // Step: 1 = email, 2 = code, 3 = new password
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");

    const [code, setCode] = useState("");

    const [password, setPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    /**
     * Étape 1: Envoyer l'email pour recevoir le code
     */
    async function handleSendCode(e) {

        e.preventDefault();

        setError("");

        setSuccess("");

        setLoading(true);

        try {

            const res = await axios.post(

                `${API_URL}/forgot-password`,

                { email }

            );

            setSuccess(res.data.message);

            setTimeout(() => setStep(2), 1500);

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Une erreur est survenue."

            );

        } finally {

            setLoading(false);

        }

    }

    /**
     * Étape 2: Vérifier le code
     */
    async function handleVerifyCode(e) {

        e.preventDefault();

        setError("");

        setSuccess("");

        setLoading(true);

        try {

            await axios.post(

                `${API_URL}/verify-reset-code`,

                { email, code }

            );

            setSuccess("Code vérifié avec succès.");

            setTimeout(() => setStep(3), 1000);

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
     * Étape 3: Réinitialiser le mot de passe
     */
    async function handleResetPassword(e) {

        e.preventDefault();

        setError("");

        setSuccess("");

        if (password.length < 8) {

            setError(

                t("password_length_error") ||

                "Le mot de passe doit contenir au moins 8 caractères."

            );

            return;

        }

        if (password !== confirmPassword) {

            setError(

                t("password_match_error") ||

                "Les mots de passe ne correspondent pas."

            );

            return;

        }

        setLoading(true);

        try {

            const res = await axios.post(

                `${API_URL}/reset-password`,

                { email, code, password }

            );

            setSuccess(res.data.message);

            setTimeout(() => navigate("/login"), 2000);

        } catch (err) {

            setError(

                err.response?.data?.message ||

                "Impossible de réinitialiser le mot de passe."

            );

        } finally {

            setLoading(false);

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

        <div className="forgot-password-page">

            {/* Back Home */}
            <Link
                to="/login"
                className="back-home"
            >
                <FaArrowLeft />
                {t("back_home") || "Back to Login"}
            </Link>

            <div className="forgot-password-container">

                {/* Header */}
                <div className="forgot-password-header">
                    <h1>KitabiSwap</h1>

                    <h2>
                        {step === 1 && (t("forgot_password") || "Mot de passe oublié")}
                        {step === 2 && (t("verify_code") || "Vérification du code")}
                        {step === 3 && (t("new_password") || "Nouveau mot de passe")}
                    </h2>

                    <p>
                        {step === 1 && (t("forgot_password_desc") || "Entrez votre email pour recevoir un code de vérification.")}
                        {step === 2 && (t("enter_code_desc") || "Entrez le code à 6 chiffres envoyé à votre email.")}
                        {step === 3 && (t("new_password_desc") || "Choisissez un nouveau mot de passe sécurisé.")}
                    </p>
                </div>

                {/* Error */}
                {error && (
                    <div className="forgot-password-error">
                        {error}
                    </div>
                )}

                {/* Success */}
                {success && (
                    <div className="forgot-password-success">
                        <FaCheckCircle />
                        <span>{success}</span>
                    </div>
                )}

                {/* ============================
                    STEP 1: Email
                ============================ */}
                {step === 1 && (
                    <form
                        onSubmit={handleSendCode}
                        className="forgot-password-form"
                    >
                        <div className="input-group">
                            <FaEnvelope className="input-icon" />
                            <input
                                type="email"
                                placeholder={t("email") || "Email"}
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="forgot-password-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <><FaSpinner className="spinner" /> {t("sending") || "Envoi..."}</>
                            ) : (
                                <><FaKey /> {t("send_code") || "Envoyer le code"}</>
                            )}
                        </button>
                    </form>
                )}

                {/* ============================
                    STEP 2: Code
                ============================ */}
                {step === 2 && (
                    <form
                        onSubmit={handleVerifyCode}
                        className="forgot-password-form"
                    >
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
                            className="forgot-password-button"
                            disabled={loading || code.length !== 6}
                        >
                            {loading ? (
                                <><FaSpinner className="spinner" /> {t("verifying") || "Vérification..."}</>
                            ) : (
                                <>{t("verify") || "Vérifier"}</>
                            )}
                        </button>

                        <button
                            type="button"
                            className="forgot-password-back"
                            onClick={() => { setStep(1); setError(""); setSuccess(""); }}
                        >
                            <FaArrowLeft /> {t("back") || "Retour"}
                        </button>
                    </form>
                )}

                {/* ============================
                    STEP 3: New Password
                ============================ */}
                {step === 3 && (
                    <form
                        onSubmit={handleResetPassword}
                        className="forgot-password-form"
                    >
                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                placeholder={t("new_password") || "Nouveau mot de passe"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <div className="input-group">
                            <FaLock className="input-icon" />
                            <input
                                type="password"
                                placeholder={t("confirm_new_password") || "Confirmer le mot de passe"}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                minLength={8}
                            />
                        </div>

                        <button
                            type="submit"
                            className="forgot-password-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <><FaSpinner className="spinner" /> {t("resetting") || "Réinitialisation..."}</>
                            ) : (
                                <>{t("reset_password") || "Réinitialiser le mot de passe"}</>
                            )}
                        </button>
                    </form>
                )}

                {/* Footer */}
                <div className="forgot-password-footer">
                    <p>
                        {t("remember_password") || "Vous vous souvenez de votre mot de passe ?"}
                    </p>
                    <Link to="/login">
                        {t("login") || "Connexion"}
                    </Link>
                </div>

                {/* Steps indicator */}
                <div className="steps-indicator">
                    <div className={`step ${step >= 1 ? "active" : ""}`}>
                        <div className="step-number">1</div>
                        <span>{t("email") || "Email"}</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 2 ? "active" : ""}`}>
                        <div className="step-number">2</div>
                        <span>{t("code") || "Code"}</span>
                    </div>
                    <div className="step-line"></div>
                    <div className={`step ${step >= 3 ? "active" : ""}`}>
                        <div className="step-number">3</div>
                        <span>{t("password") || "Mot de passe"}</span>
                    </div>
                </div>

            </div>

        </div>

    );

}

