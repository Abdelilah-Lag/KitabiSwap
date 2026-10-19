import "./MagazineSection.css";

import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import MagazineBookCard from "./MagazineBookCard";

export default function MagazineSection({ books, showTitle = true, showAll = true }) {

    const { t } = useTranslation();

    return (

        <section className="magazine-section">

            <div className="magazine-container">

                {(showTitle || showAll) && (
                    <div className="magazine-header">
                        {showTitle ? (
                            <div>
                                <h2>
                                    {t("magazine_title")}
                                </h2>
                                <p>
                                    {t("magazine_description")}
                                </p>
                            </div>
                        ) : <div />}

                        {showAll && (
                            <Link
                                to="/shop"
                                className="magazine-view-all"
                            >
                                {t("see_all_magazine")}
                            </Link>
                        )}
                    </div>
                )}

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

                                key={book.id}

                            >

                                <MagazineBookCard

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