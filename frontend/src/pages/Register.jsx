import "./Register.css";

import axios from "axios";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import {
    FaArrowLeft,
    FaUser,
    FaEnvelope,
    FaPhone,
    FaLock
} from "react-icons/fa";

export default function Register() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [form, setForm] = useState({

        first_name: "",

        last_name: "",

        email: "",

        phone: "",

        password: "",

        confirmPassword: ""

    });

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");

    function handleChange(e) {

        setForm({

            ...form,

            [e.target.name]: e.target.value

        });

    }

    async function handleRegister(e) {

        e.preventDefault();

        setError("");

        setSuccess("");

        if (form.password.length < 8) {

            setError(t("password_length_error") || "Password must contain at least 8 characters.");

            return;

        }

        if (form.password !== form.confirmPassword) {

            setError(t("password_match_error") || "Passwords do not match.");

            return;

        }

        setLoading(true);

        try {

            const res = await axios.post(

                "http://localhost:5000/api/auth/register",

                {

                    first_name: form.first_name,

                    last_name: form.last_name,

                    email: form.email,

                    phone: form.phone,

                    password: form.password

                }

            );

            setSuccess(res.data.message);

            setTimeout(() => {

                navigate(`/verify-email?email=${encodeURIComponent(form.email)}`);

            }, 1500);

        }

        catch (err) {

            setError(

                err.response?.data?.message ||

                "Registration failed."

            );

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <div className="register-page">

            <Link
                to="/"
                className="back-home"
            >

                <FaArrowLeft />

                {t("back_home") || "Back to Home"}

            </Link>

            <div className="register-container">

                <div className="register-header">

                    <h1>KitabiSwap</h1>

                    <h2>{t("register") || "Create Account"}</h2>

                    <p>{t("join_our_community") || "Join our community."}</p>

                </div>

                {

                    error &&

                    <div className="register-error">

                        {error}

                    </div>

                }

                {

                    success &&

                    <div className="register-success">

                        {success}

                    </div>

                }

                <form
                    onSubmit={handleRegister}
                    className="register-form"
                >

                    <div className="input-group">

                        <FaUser className="input-icon" />

                        <input

                            type="text"

                            name="first_name"

                            placeholder={t("first_name") || "First Name"}

                            value={form.first_name}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="input-group">

                        <FaUser className="input-icon" />

                        <input

                            type="text"

                            name="last_name"

                            placeholder={t("last_name") || "Last Name"}

                            value={form.last_name}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="input-group">

                        <FaEnvelope className="input-icon" />

                        <input

                            type="email"

                            name="email"

                            placeholder={t("email") || "Email"}

                            value={form.email}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="input-group">

                        <FaPhone className="input-icon" />

                        <input

                            type="tel"

                            name="phone"

                            placeholder={t("phone") || "Phone"}

                            value={form.phone}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="input-group">

                        <FaLock className="input-icon" />

                        <input

                            type="password"

                            name="password"

                            placeholder={t("password") || "Password"}

                            value={form.password}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <div className="input-group">

                        <FaLock className="input-icon" />

                        <input

                            type="password"

                            name="confirmPassword"

                            placeholder={t("confirm_password") || "Confirm Password"}

                            value={form.confirmPassword}

                            onChange={handleChange}

                            required

                        />

                    </div>

                    <button

                        type="submit"

                        className="register-button"

                        disabled={loading}

                    >

                        {

                            loading

                                ?

                                t("creating") || "Creating..."

                                :

                                t("create_account") || "Create Account"

                        }

                    </button>

                </form>

                <div className="login-link">

                    <p>

                        {t("already_have_account") || "Already have an account?"}

                    </p>

                    <Link to="/login">

                        {t("login") || "Login"}

                    </Link>

                </div>

            </div>

        </div>

    );

}