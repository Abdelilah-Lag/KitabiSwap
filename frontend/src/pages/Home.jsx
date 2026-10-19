import "./Home.css";
import axios from "axios";

import Header from "../header/Header";
import Footer from "../footer/Footer";
import ExchangeSection from "../book/ExchangeSection";
import MagazineSection from "../book/MagazineSection";

import heroImage from "../images/hero_books.png";

import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {

    const { t } = useTranslation();

    const [exchangeBooks, setExchangeBooks] = useState([]);

    const [magazineBooks, setMagazineBooks] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadHome();

    }, []);

    async function loadHome() {

        try {

            const res = await axios.get(

                "http://localhost:5000/api/home"

            );

            setExchangeBooks(res.data.exchangeBooks);

            setMagazineBooks(res.data.magazineBooks);

        }

        catch (error) {

            console.error(error);

        }

        finally {

            setLoading(false);

        }

    }

    return (

        <>

            <Header />

            {/* ================= HERO ================= */}

            <section className="hero">

                <div className="hero-container">

                    <div className="hero-left">

                        <h1>

                            {t("hero_title_1")}

                            <br />

                            <span>

                                {t("hero_title_2")}

                            </span>

                            <br />

                            {t("hero_title_3")}

                        </h1>

                        <p>

                            {t("hero_description")}

                        </p>

                        <div className="hero-buttons">

                            <Link
                                to="/explore"
                                className="btn-primary"
                            >

                                {t("explore_books")}

                            </Link>

                            <a
                                href="#how-it-works"
                                className="btn-secondary"
                            >

                                {t("how_it_works")}

                            </a>

                        </div>

                        <div className="hero-stats">

                            <div>

                                <h2>10K+</h2>

                                <span>{t("users")}</span>

                            </div>

                            <div>

                                <h2>25K+</h2>

                                <span>{t("books")}</span>

                            </div>

                            <div>

                                <h2>500+</h2>

                                <span>{t("exchanges")}</span>

                            </div>

                            <div>

                                <h2>1200+</h2>

                                <span>{t("magazine")}</span>

                            </div>

                        </div>

                    </div>

                    <div className="hero-right">

                        <img

                            src={heroImage}

                            alt="KitabiSwap"

                        />

                    </div>

                </div>

            </section>

            {/* ================= EXCHANGE BOOKS ================= */}

            {

                loading ?

                (

                    <div className="loading">

                        {t("loading")}

                    </div>

                )

                :

                (

                    <>

                        <ExchangeSection

                            books={exchangeBooks}

                        />

                        <MagazineSection

                            books={magazineBooks}

                        />

                    </>

                )

            }
            {/* ================= HOW IT WORKS ================= */}
                <section id="how-it-works" className="how-it-works">
                    <div className="container">

                        <div className="section-title">
                            <h2>{t("how_it_works_title")}</h2>
                            <p>{t("how_it_works_description")}</p>
                        </div>

                        <div className="steps">

                            <div className="step-card">
                                <div className="step-number">1</div>
                                <h3>{t("step1_title")}</h3>
                                <p>{t("step1_desc")}</p>
                            </div>

                            <div className="step-card">
                                <div className="step-number">2</div>
                                <h3>{t("step2_title")}</h3>
                                <p>{t("step2_desc")}</p>
                            </div>

                            <div className="step-card">
                                <div className="step-number">3</div>
                                <h3>{t("step3_title")}</h3>
                                <p>{t("step3_desc")}</p>
                            </div>

                            <div className="step-card">
                                <div className="step-number">4</div>
                                <h3>{t("step4_title")}</h3>
                                <p>{t("step4_desc")}</p>
                            </div>

                        </div>

                    </div>
                </section>

            <Footer />

        </>

    );

}