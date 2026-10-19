import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import Header from "../header/Header";
import Footer from "../footer/Footer";

import "./FAQ.css";

export default function FAQ() {

    const { t } = useTranslation();

    const [search, setSearch] = useState("");

    const [category, setCategory] = useState("all");

    const [openIndex, setOpenIndex] = useState(null);

    const categories = [

        {
            key: "all",
            label: t("faq_category_all"),
            icon: "📚"
        },

        {
            key: "wallet",
            label: t("faq_category_wallet"),
            icon: "💰"
        },

        {
            key: "exchange",
            label: t("faq_category_exchange"),
            icon: "🔄"
        },

        {
            key: "magazine",
            label: t("faq_category_magazine"),
            icon: "📖"
        },

        {
            key: "delivery",
            label: t("faq_category_delivery"),
            icon: "🚚"
        },

        {
            key: "account",
            label: t("faq_category_account"),
            icon: "👤"
        }

    ];

    const faqData = [

        {
            category: "wallet",
            question: t("faq_wallet_q"),
            answer: t("faq_wallet_a")
        },

        {
            category: "wallet",
            question: t("faq_recharge_q"),
            answer: t("faq_recharge_a")
        },

        {
            category: "magazine",
            question: t("faq_order_q"),
            answer: t("faq_order_a")
        },

        {
            category: "magazine",
            question: t("faq_cancel_q"),
            answer: t("faq_cancel_a")
        },

        {
            category: "exchange",
            question: t("faq_exchange_q"),
            answer: t("faq_exchange_a")
        },

        {
            category: "delivery",
            question: t("faq_delivery_q"),
            answer: t("faq_delivery_a")
        },

        {
            category: "account",
            question: t("faq_contact_q"),
            answer: t("faq_contact_a")
        }

    ];

    const filteredFaqs = useMemo(() => {

        return faqData.filter((item) => {

            const matchCategory =
                category === "all" ||
                item.category === category;

            const keyword =
                search.toLowerCase();

            const matchSearch =

                item.question
                    .toLowerCase()
                    .includes(keyword)

                ||

                item.answer
                    .toLowerCase()
                    .includes(keyword);

            return matchCategory && matchSearch;

        });

    }, [faqData, category, search]);

    function toggle(index) {

        setOpenIndex(

            openIndex === index

                ? null

                : index

        );

    }

    return (

        <>

            <Header />

            {/* HERO */}

            <section className="faq-hero">

                <div className="faq-hero-container">

                    <span className="faq-tag">

                        {t("faq_tag")}

                    </span>

                    <h1>

                        {t("faq_title")}

                    </h1>

                    <p>

                        {t("faq_description")}

                    </p>

                    <div className="faq-search">

                        <input

                            type="text"

                            placeholder={
                                t("faq_search_placeholder")
                            }

                            value={search}

                            onChange={(e) =>
                                setSearch(e.target.value)
                            }

                        />

                    </div>

                </div>

            </section>

            {/* CATEGORIES */}

            <section className="faq-categories">

                <div className="faq-container">

                    <div className="faq-category-list">

                        {
                            categories.map((cat) => (

                                <button

                                    key={cat.key}

                                    className={

                                        category === cat.key

                                            ? "faq-category active"

                                            : "faq-category"

                                    }

                                    onClick={() => {

                                        setCategory(cat.key);

                                        setOpenIndex(null);

                                    }}

                                >

                                    <span>

                                        {cat.icon}

                                    </span>

                                    {cat.label}

                                </button>

                            ))
                        }

                    </div>

                </div>

            </section>

            {/* FAQ LIST */}

            <section className="faq-section">

                <div className="faq-container">
                                      {

                        filteredFaqs.length === 0

                            ?

                            (

                                <div className="faq-empty">

                                    <h3>
    😕 {t("faq_no_result_title")}
</h3>

<p>
    {t("faq_no_result_desc")}
</p>

                                </div>

                            )

                            :

                            (

                                filteredFaqs.map((faq, index) => (

                                    <div

                                        key={index}

                                        className={

                                            openIndex === index

                                                ? "faq-item active"

                                                : "faq-item"

                                        }

                                    >

                                        <button

                                            className="faq-question"

                                            onClick={() => toggle(index)}

                                        >

                                            <span>

                                                {faq.question}

                                            </span>

                                            <span

                                                className={

                                                    openIndex === index

                                                        ? "faq-plus rotate"

                                                        : "faq-plus"

                                                }

                                            >

                                                +

                                            </span>

                                        </button>

                                        <div

                                            className={

                                                openIndex === index

                                                    ? "faq-answer show"

                                                    : "faq-answer"

                                            }

                                        >

                                            <p>

                                                {faq.answer}

                                            </p>

                                        </div>

                                    </div>

                                ))

                            )

                    }

                </div>

            </section>

            {/* CTA */}

            <section className="faq-contact-section">

                <div className="faq-contact-card">

                    <h2>

                        {t("faq_cta_title")}

                    </h2>

                    <p>

                        {t("faq_cta_desc")}

                    </p>

                    <Link

                        to="/contact"

                        className="faq-contact-btn"

                    >

                        {t("faq_contact_button")}

                    </Link>

                </div>

            </section>

            <Footer />

        </>

    );

}
