import "./UserBookCard.css";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function UserBookCard({

    book,

    type

}){

    const { t } = useTranslation();

    const conditionClass =

        (book.book_condition || "")

            .toLowerCase()

            .replace(/\s+/g,"_");

    const statusClass =

        (book.status || "")

            .toLowerCase()

            .replace(/\s+/g,"_");

    return(

        <div className="user-book-card">

            <div className="user-book-image">

                <img

                    src={

                        book.cover ||

                        "/images/book-placeholder.png"

                    }

                    alt={book.title}

                />

                <div

                    className={`user-book-status ${statusClass}`}

                >

                    {t(book.status)}

                </div>

                <div

                    className={`user-book-condition ${conditionClass}`}

                >

                    {book.book_condition}

                </div>

            </div>

            <div className="user-book-content">

                <h3>

                    {book.title}

                </h3>

                <p className="user-book-author">

                    {book.author}

                </p>

                <div className="user-book-grid">

                    <div>

                        <span>

                            {t("condition")}

                        </span>

                        <strong>

                            {book.book_condition}

                        </strong>

                    </div>

                    <div>

                        <span>

                            {t("availability")}

                        </span>

                        <strong>

                            {t(book.status)}

                        </strong>

                    </div>

                </div>

                <div className="user-book-price">

                    <span>

                        {t("estimated_price")}

                    </span>

                    <strong>

                        {Number(

                            book.estimated_price ||

                            book.price ||

                            0

                        )} DH

                    </strong>

                </div>

                <div className="user-book-footer">

                    <small>

                        {t("added_on")} :

                        {" "}

                        {

                            new Date(

                                book.created_at

                            ).toLocaleDateString()

                        }

                    </small>

                    <Link

                        to={`/user/my-book/${type}/${book.id}`}

                        className="user-book-btn"

                    >

                        {t("view_details")}

                    </Link>

                </div>

            </div>

        </div>

    );

}

