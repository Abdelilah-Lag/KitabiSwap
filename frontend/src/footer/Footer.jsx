import "./Footer.css";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

import logo from "../images/logo_kitabiswap.png";

export default function Footer() {

    const { t } = useTranslation();

    const year = new Date().getFullYear();

    return (

        <footer className="footer">

            <div className="footer-container">

                <div className="footer-column">

                    <div className="footer-logo">

                        <img
                            src={logo}
                            alt="KitabiSwap"
                        />

                        <h2>KitabiSwap</h2>

                    </div>

                    <p>

                        {t("footer_description")}

                    </p>

                </div>

                <div className="footer-column">

                    <h3>{t("navigation")}</h3>

                    <Link to="/">
                        {t("home")}
                    </Link>

                    <Link to="/explore">
                        {t("explore")}
                    </Link>

                    <Link to="/shop">
                        {t("shop")}
                    </Link>

                    <Link to="/about">
                        {t("about")}
                    </Link>

                </div>

                <div className="footer-column">

                    <h3>{t("support")}</h3>

                    <Link to="/contact">
                        {t("contact")}
                    </Link>

                    <Link to="/faq">
                        FAQ
                    </Link>

                    <Link to="/privacy-policy">
                        {t("privacy")}
                    </Link>

                    <Link to="/terms">
                        {t("terms")}
                    </Link>

                </div>

                <div className="footer-column">

                    <h3>{t("contact")}</h3>

                    <p>✉️ kitabiswap@gmail.com</p>

                    <p>🌐 www.kitabiswap.com</p>

                    <p> Rabat - Morocco</p>

                </div>

            </div>

            <div className="footer-bottom">

                © {year} KitabiSwap — {t("rights")}

            </div>

        </footer>

    );

}