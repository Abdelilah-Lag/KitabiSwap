import "./BookInfo.css";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function BookInfo({ data }) {

    const { t } = useTranslation();

    const book = data.book;

    return (

        <div className="book-info">

            <div className="book-info-body">

                <div className="book-type">

                {

                    data.type === "exchange"

                        ? t("exchange_book")

                        : t("magazine_book")

                }

            </div>

                <h1 className="book-name">{book.title}</h1>

                <p className="book-author">{book.author}</p>

            <div className="book-meta">

                <div className="meta-row">

                    <span className="meta-label">{t("publisher")} :</span>

                    <span className="meta-value">{book.publisher ?? '-'}</span>

                </div>

                <div className="meta-row">

                    <span className="meta-label">{t("edition")} :</span>

                    <span className="meta-value">{book.edition ?? '-'}</span>

                </div>

                <div className="meta-row">

                    <span className="meta-label">{t("publication_year")} :</span>

                    <span className="meta-value">{book.publicationYear ?? '-'}</span>

                </div>

                <div className="meta-row">

                    <span className="meta-label">{t("language")} :</span>

                    <span className="meta-value">{book.language ?? '-'}</span>

                </div>

                <div className="meta-row">

                    <span className="meta-label">{t("category")} :</span>

                    <span className="meta-value">{book.category ?? '-'}</span>

                </div>

                <div className="meta-row">

                    <span className="meta-label">{t("pages")} :</span>

                    <span className="meta-value">{book.pages ?? '-'}</span>

                </div>

                <div className="meta-row">

                    <span className="meta-label">ISBN :</span>

                    <span className="meta-value">{book.isbn ?? '-'}</span>

                </div>

            </div>

        </div>

            {

                data.type === "exchange" &&

                <>

                    <div className="book-extra">

                        <span>

                            {t("condition")} :

                        </span>

                        <strong>

                            {data.condition}

                        </strong>

                    </div>

                    {

                        data.estimatedPrice &&

                        <div className="book-extra">

                            <span>

                                {t("estimated_price")} :

                            </span>

                            <strong>

                                {data.estimatedPrice} DH

                            </strong>

                        </div>

                    }

                    <div className="book-extra">

                        <span>

                            {t("proposed_by")} :

                        </span>

                        <strong>

                            {data.owner.name}

                        </strong>

                    </div>

                </>

            }

            {

                data.type === "magazine" &&

                <>

                    <div className="book-extra">

                        <span>

                            {t("price")} :

                        </span>

                        <strong>

                            {data.sellingPrice} DH

                        </strong>

                    </div>

                    {

                        data.oldPrice &&

                        <div className="book-extra">

                            <span>

                                {t("old_price")} :

                            </span>

                            <strong className="old-price">

                                {data.oldPrice} DH

                            </strong>

                        </div>

                    }

                    <div className="book-extra">

                        <span>

                            {t("stock")} :

                        </span>

                        <strong>

                            {

                                data.stock > 0

                                    ? `${data.stock} ${t("available")}`

                                    : t("out_of_stock")

                            }

                        </strong>

                    </div>

                </>

            }
            <Link

                to="/login"

                className="book-action"

            >

                {

                    data.type === "exchange"

                        ? t("request_exchange")

                        : t("request_book")

                }

            </Link>

        </div>

    );

}