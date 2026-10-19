// src/book/ExchangeSection.jsx

import "./ExchangeSection.css";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import BookCard from "./BookCard";

export default function ExchangeSection({ books }) {

    const { t } = useTranslation();

    return (

        <section className="exchange-section">

            <div className="exchange-container">

                <div className="exchange-header">

                    <div>

                        <h2>

                            {t("exchange_books_title")}

                        </h2>

                        <p>

                            {t("exchange_books_description")}

                        </p>

                    </div>

                    <Link
                        to="/explore"
                        className="exchange-view-all"
                    >

                        {t("view_all")}

                    </Link>

                </div>

                <Swiper

                    modules={[Navigation]}

                    navigation

                    spaceBetween={30}

                    slidesPerView={4}

                    speed={700}

                    loop={books.length > 4}

                    breakpoints={{

                        0:{

                            slidesPerView:1

                        },

                        650:{

                            slidesPerView:2

                        },

                        950:{

                            slidesPerView:3

                        },

                        1300:{

                            slidesPerView:4

                        }

                    }}

                >

                    {

                        books.map(book=>(

                            <SwiperSlide

                                key={book.userBookId}

                            >

                                <BookCard

                                    book={book}

                                />

                            </SwiperSlide>

                        ))

                    }

                </Swiper>

            </div>

        </section>

    );

}