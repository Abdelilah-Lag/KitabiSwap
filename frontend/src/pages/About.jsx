import "./About.css";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import mainImage from "../images/main.png";
import myImage from "../images/mon_image.jpg";

import { useTranslation } from "react-i18next";

export default function About() {

    const { t } = useTranslation();

    return (  
         <>

            <Header />

            {/* ======================================================
                            HERO SECTION
            ======================================================= */}

            <section className="about-hero">

                <div className="about-container">

                    <div className="about-left">

                        <span className="about-tag">
                            {t("about_tag")}
                        </span>

                        <h1>
                            {t("about_title")}
                        </h1>

                        <p>
                            {t("about_description")}
                        </p>

                        <a
                            href="#our-mission"
                            className="about-btn"
                        >
                            {t("learn_more")}
                        </a>

                    </div>

                    <div className="about-right">

                        <img
                            src={mainImage}
                            alt="KitabiSwap"
                        />

                    </div>

                </div>

            </section>

            {/* ======================================================
                            OUR MISSION
            ======================================================= */}

            <section
                id="our-mission"
                className="mission-section"
            >

                <div className="about-container">

                    <div className="mission-content">

                        <div className="section-title">

                            <h2>
                                {t("our_mission")}
                            </h2>

                        </div>

                        <p>
                            {t("mission_paragraph1")}
                        </p>

                        <p>
                            {t("mission_paragraph2")}
                        </p>

                        <p>
                            {t("mission_paragraph3")}
                        </p>

                    </div>

                </div>

            </section>

            {/* ======================================================
                    PARTIE 2 :
                    WHY CHOOSE KITABISWAP
            ======================================================= */}
                        {/* ======================================================
                        WHY CHOOSE KITABISWAP
            ======================================================= */}

            <section className="features-section">

                <div className="about-container">

                    <div className="section-title">

                        <h2>
                            {t("why_choose")}
                        </h2>

                        <p>
                            {t("why_choose_description")}
                        </p>

                    </div>

                    <div className="features-grid">

                        {/* Exchange */}

                        <div className="feature-card">

                            <div className="feature-icon">
                                📚
                            </div>

                            <h3>
                                {t("feature_title_1")}
                            </h3>

                            <p>
                                {t("feature_desc_1")}
                            </p>

                        </div>

                        {/* Delivery */}

                        <div className="feature-card">

                            <div className="feature-icon">
                                🚚
                            </div>

                            <h3>
                                {t("feature_title_2")}
                            </h3>

                            <p>
                                {t("feature_desc_2")}
                            </p>

                        </div>

                        {/* Sell */}

                        <div className="feature-card">

                            <div className="feature-icon">
                                💰
                            </div>

                            <h3>
                                {t("feature_title_3")}
                            </h3>

                            <p>
                                {t("feature_desc_3")}
                            </p>

                        </div>

                        {/* Community */}

                        <div className="feature-card">

                            <div className="feature-icon">
                                🌍
                            </div>

                            <h3>
                                {t("feature_title_4")}
                            </h3>

                            <p>
                                {t("feature_desc_4")}
                            </p>

                        </div>

                    </div>

                </div>

            </section>

            {/* ======================================================
                        PLATFORM VALUES
            ======================================================= */}

            <section className="mission-section">

                <div className="about-container">

                    <div className="mission-content">

                        <div className="section-title">

                            <h2>
                                {t("our_values")}
                            </h2>

                            <p>
                                {t("our_values_desc")}
                            </p>

                        </div>

                        <p>
                            {t("value_paragraph_1")}
                        </p>

                        <p>
                            {t("value_paragraph_2")}
                        </p>

                        <p>
                            {t("value_paragraph_3")}
                        </p>

                    </div>

                </div>

            </section>

            {/* ======================================================
                    PARTIE 3 :
                    HOW IT WORKS
            ======================================================= */}
                        {/* ======================================================
                        HOW KITABISWAP WORKS
            ======================================================= */}

            <section className="timeline-section">

                <div className="about-container">

                    <div className="timeline-title">

                        <h2>
                            {t("how_title")}
                        </h2>

                        <p>
                            {t("how_description")}
                        </p>

                    </div>

                    <div className="timeline">

                        {/* STEP 1 */}

                        <div className="timeline-item left">

                            <div className="timeline-dot"></div>

                            <div className="timeline-content">

                                <div className="step-badge">
                                    1
                                </div>

                                <h3>
                                    {t("how_step1_title")}
                                </h3>

                                <p>
                                    {t("how_step1_desc")}
                                </p>

                            </div>

                        </div>

                        {/* STEP 2 */}

                        <div className="timeline-item right">

                            <div className="timeline-dot"></div>

                            <div className="timeline-content">

                                <div className="step-badge">
                                    2
                                </div>

                                <h3>
                                    {t("how_step2_title")}
                                </h3>

                                <p>
                                    {t("how_step2_desc")}
                                </p>

                            </div>

                        </div>

                        {/* STEP 3 */}

                        <div className="timeline-item left">

                            <div className="timeline-dot"></div>

                            <div className="timeline-content">

                                <div className="step-badge">
                                    3
                                </div>

                                <h3>
                                    {t("how_step3_title")}
                                </h3>

                                <p>
                                    {t("how_step3_desc")}
                                </p>

                            </div>

                        </div>

                        {/* STEP 4 */}

                        <div className="timeline-item right">

                            <div className="timeline-dot"></div>

                            <div className="timeline-content">

                                <div className="step-badge">
                                    4
                                </div>

                                <h3>
                                    {t("how_step4_title")}
                                </h3>

                                <p>
                                    {t("how_step4_desc")}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>

            {/* ======================================================
                    PARTIE 4 :
                    ABOUT THE CREATOR
            ======================================================= */}
                        {/* ======================================================
                        ABOUT THE CREATOR
            ======================================================= */}

            <section className="creator-section">

                <div className="about-container">

                    <div className="creator-container">

                        <div className="creator-image">

                            <img
                                src={myImage}
                                alt="Lagribi Abdelilah"
                            />

                        </div>

                        <div className="creator-content">

                            <span className="creator-subtitle">
                                {t("creator_subtitle")}
                            </span>

                            <h2>
                                {t("creator_title")}
                            </h2>

                            <h3>
                                {t("creator_name")}
                            </h3>

                            <p>
                                {t("creator_description")}
                            </p>

                            <div className="creator-info">

                                <div>

                                    <strong>
                                        {t("degree_label")}
                                    </strong>

                                    {" "}

                                    {t("degree_value")}

                                </div>

                                <div>

                                    <strong>
                                        {t("university_label")}
                                    </strong>

                                    {" "}

                                    {t("university_value")}

                                </div>

                                <div>

                                    <strong>
                                        {t("speciality_label")}
                                    </strong>

                                    {" "}

                                    {t("speciality_value")}

                                </div>

                            </div>

                            <a
                                href="https://lagribi-abdelilah.lovable.app"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="portfolio-btn"
                            >
                                {t("visit_portfolio")}
                            </a>

                        </div>

                    </div>

                </div>

            </section>

            <Footer />

        </>

    );

}