import "./Login.css";

import axios from "axios";

import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import { FaEnvelope } from "react-icons/fa";

import { FaLock } from "react-icons/fa";

import { FaArrowLeft } from "react-icons/fa";

export default function Login() {

    const { t } = useTranslation();

    const navigate = useNavigate();

    const [email, setEmail] = useState("");

    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    const [pendingEmail, setPendingEmail] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        setError("");

        setLoading(true);

        try {

            const res = await axios.post(

                "http://localhost:5000/api/auth/login",

                {

                    email,

                    password

                }

            );

            const { token, user } = res.data;

            localStorage.setItem(

                "token",

                token

            );

            localStorage.setItem(

                "user",

                JSON.stringify(user)

            );

            switch (user.role) {

                case "admin":

                    navigate("/admin");

                    break;

                case "user":

                    navigate("/user");

                    break;

                case "controller":

                    navigate("/controller");

                    break;

                case "warehouse_manager":

                    navigate("/warehouse");

                    break;

                case "payment_manager":

                    navigate("/payment");

                    break;
                    
                case "delivery":

                    navigate("/delivery");

                    break;

                default:

                    navigate("/");

            }

        }

        catch (err) {

            const errorMsg = err.response?.data?.message || t("login_failed");

            setError(errorMsg);

            // Si l'erreur est liée à la vérification d'email, stocker l'email pour proposer un lien
            if (errorMsg.includes("vérifier votre adresse email")) {
                setPendingEmail(email);
            }

        }

        finally {

            setLoading(false);

        }

    }
        return (

        <div className="login-page">


            {/* Back Home */}

            <Link 
                to="/" 
                className="back-home"
            >

                <FaArrowLeft />

                {t("back_home") || "Back to Home"}

            </Link>



            <div className="login-container">


                {/* Header */}

                <div className="login-header">


                    <h1>
                        KitabiSwap
                    </h1>


                    <h2>
                        {t("login") || "Login"}
                    </h2>


                    <p>
                        {t("welcome_back") || 
                        "Welcome back to KitabiSwap"}
                    </p>


                </div>





                {/* Error Message */}

                {
                    error && (

                        <div className="login-error">

                            {error}

                            {pendingEmail && (
                                <div style={{ marginTop: "10px" }}>
                                    <Link
                                        to={`/verify-email?email=${encodeURIComponent(pendingEmail)}`}
                                        style={{ color: "#2563eb", fontWeight: 600, fontSize: "14px" }}
                                    >
                                        {t("verify_email_now") || "Vérifier mon email maintenant"}
                                    </Link>
                                </div>
                            )}

                        </div>

                    )
                }






                {/* Login Form */}

                <form 
                    onSubmit={handleLogin}
                    className="login-form"
                >




                    {/* Email */}

                    <div className="input-group">


                        <FaEnvelope 
                            className="input-icon"
                        />


                        <input

                            type="email"

                            placeholder={
                                t("email") || "Email"
                            }

                            value={email}

                            onChange={
                                (e)=>setEmail(e.target.value)
                            }

                            required

                        />


                    </div>








                    {/* Password */}

                    <div className="input-group">


                        <FaLock 
                            className="input-icon"
                        />


                        <input

                            type="password"

                            placeholder={
                                t("password") || "Password"
                            }

                            value={password}

                            onChange={
                                (e)=>setPassword(e.target.value)
                            }

                            required

                        />


                    </div>








                    {/* Forgot Password */}

                    <div className="forgot-password">


                        <Link to="/forgot-password">

                            {t("forgot_password") || 
                            "Forgot password?"}

                        </Link>


                    </div>








                    {/* Submit Button */}

                    <button

                        type="submit"

                        className="login-button"

                        disabled={loading}

                    >


                        {

                            loading

                            ?

                            t("loading") || "Loading..."

                            :

                            t("login") || "Login"

                        }


                    </button>




                </form>








                {/* Register Link */}


                <div className="register-link">


                    <p>

                        {
                            t("dont_have_account") 
                            ||
                            "Don't have an account?"
                        }


                    </p>



                    <Link 
                        to="/register"
                        className="create-account"
                    >

                        {

                            t("create_account")

                            ||

                            "Create Account"

                        }

                    </Link>


                </div>




            </div>


        </div>

    );

}