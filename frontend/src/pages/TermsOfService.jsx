import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import "./TermsOfService.css";

export default function TermsOfService() {

    const { t } = useTranslation();

    return (

        <>

            <Header />

            {/* =======================================================
                HERO
            ======================================================= */}

            <section className="terms-hero">

                <div className="terms-hero-container">

                    <span className="terms-tag">

                        {t("terms_tag")}

                    </span>

                    <h1>

                        {t("terms_page_title")}

                    </h1>

                    <p>

                        {t("terms_page_desc")}

                    </p>

                    <div className="terms-update">

                        📅 {t("terms_last_update")}

                    </div>

                </div>

            </section>

            {/* =======================================================
                CONTENT
            ======================================================= */}

            <section className="terms-section-main">

                <div className="terms-container">

                    {/* ===========================
                        INTRO
                    =========================== */}

                    <div className="terms-card">

                        <h2>

                            {t("terms_intro_title")}

                        </h2>

                        <p>

                            {t("terms_intro")}

                        </p>

                    </div>

                    {/* ===========================
                        TABLE OF CONTENT
                    =========================== */}

                    <div className="terms-summary">

                        <h3>

                            {t("terms_summary_title")}

                        </h3>

                        <ul>

                            <li>

                                <a href="#accounts">

                                    👤 {t("terms_accounts_title")}

                                </a>

                            </li>

                            <li>

                                <a href="#books">

                                    📚 {t("terms_books_title")}

                                </a>

                            </li>

                            <li>

                                <a href="#payments">

                                    💳 {t("terms_payments_title")}

                                </a>

                            </li>

                            <li>

                                <a href="#delivery">

                                    🚚 {t("terms_delivery_title")}

                                </a>

                            </li>

                            <li>

                                <a href="#responsibility">

                                    ⚖️ {t("terms_responsibility_title")}

                                </a>

                            </li>

                            <li>

                                <a href="#changes">

                                    🔄 {t("terms_modifications_title")}

                                </a>

                            </li>

                        </ul>

                    </div>

                    {/* ===========================
                        ACCOUNTS
                    =========================== */}

                    <div

                        id="accounts"

                        className="terms-card"

                    >

                        <h2>

                            👤 {t("terms_accounts_title")}

                        </h2>

                        <p>

                            {t("terms_accounts_desc")}

                        </p>

                    </div>

                    {/* ===========================
                        BOOKS
                    =========================== */}

                    <div

                        id="books"

                        className="terms-card"

                    >

                        <h2>

                            📚 {t("terms_books_title")}

                        </h2>

                        <p>

                            {t("terms_books_desc")}

                        </p>

                        <div className="terms-highlight">

                            {t("terms_books_highlight")}

                        </div>
                        </div>
                                            {/* ===========================
                        PAYMENTS
                    =========================== */}

                    <div
                        id="payments"
                        className="terms-card"
                    >

                        <h2>

                            💳 {t("terms_payments_title")}

                        </h2>

                        <p>

                            {t("terms_payments_desc")}

                        </p>

                        <ul className="terms-list">

                            <li>

                                {t("terms_payments_item_1")}

                            </li>

                            <li>

                                {t("terms_payments_item_2")}

                            </li>

                        </ul>

                    </div>

                    {/* ===========================
                        DELIVERY
                    =========================== */}

                    <div
                        id="delivery"
                        className="terms-card"
                    >

                        <h2>

                            🚚 {t("terms_delivery_title")}

                        </h2>

                        <p>

                            {t("terms_delivery_desc")}

                        </p>

                        <div className="terms-note">

                            {t("terms_delivery_note")}

                        </div>

                    </div>

                    {/* ===========================
                        RESPONSIBILITY
                    =========================== */}

                    <div
                        id="responsibility"
                        className="terms-card"
                    >

                        <h2>

                            ⚖️ {t("terms_responsibility_title")}

                        </h2>

                        <p>

                            {t("terms_responsibility_desc")}

                        </p>

                        <div className="terms-warning">

                            ⚠️ {t("terms_responsibility_note")}

                        </div>

                    </div>

                    {/* ===========================
                        MODIFICATIONS
                    =========================== */}

                    <div
                        id="changes"
                        className="terms-card"
                    >

                        <h2>

                            🔄 {t("terms_modifications_title")}

                        </h2>

                        <p>

                            {t("terms_modifications_desc")}

                        </p>

                        <div className="terms-note">

                            {t("terms_modifications_note")}

                        </div>

                    </div>

                    {/* ===========================
                        IMPORTANT
                    =========================== */}

                    <div className="terms-important">

                        <h3>

                            📌 {t("terms_important_title")}

                        </h3>

                        <p>

                            {t("terms_important_desc")}

                        </p>

                    </div>

                    {/* ===========================
                        CTA
                    =========================== */}

                    <div className="terms-contact-card">

                        <h2>

                            {t("terms_contact_title")}

                        </h2>

                        <p>

                            {t("terms_contact_desc")}

                        </p>

                        <Link
                            to="/contact"
                            className="terms-contact-btn"
                        >

                            {t("terms_contact_button")}

                        </Link>

                    </div>

                </div>

            </section>

            <Footer />

        </>

    );

}