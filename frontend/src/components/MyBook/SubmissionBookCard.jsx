import "./SubmissionBookCard.css";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function SubmissionBookCard({

    book

}){

    const { t } = useTranslation();

    const statusClass =

        (book.status || "")
            .toLowerCase()
            .replace(/\s+/g,"_");

    return(

        <div className="submission-book-card">

            <div className="submission-image">

                <img

                    src={

                        book.cover ||

                        "/images/book-placeholder.png"

                    }

                    alt={book.title}

                />

                <div

                    className={`submission-status ${statusClass}`}

                >

                    {t(book.status)}

                </div>

            </div>

            <div className="submission-content">

                <h3>

                    {book.title}

                </h3>

                <p className="submission-author">

                    {book.author}

                </p>

                <div className="submission-info">

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

                            {t("request_type")}

                        </span>

                        <strong>

                            {t(book.request_type)}

                        </strong>

                    </div>

                </div>

                <div className="submission-price">

                    <div>

                        <span>

                            {t("estimated_price")}

                        </span>

                        <strong>

                            {Number(

                                book.estimated_price || 0

                            )} DH

                        </strong>

                    </div>

                    {

                        book.price && (

                            <div>

                                <span>

                                    {t("selling_price")}

                                </span>

                                <strong className="sale-price">

                                    {

                                        Number(book.price)

                                    } DH

                                </strong>

                            </div>

                        )

                    }

                </div>

                <div className="submission-footer">

                    <small>

                        {t("submitted_on")} :

                        {" "}

                        {

                            new Date(

                                book.created_at

                            ).toLocaleDateString()

                        }

                    </small>

                    <Link
                        to={`/user/my-book/submission/${book.id}`}
                        className="submission-btn"
                    >

                        {t("view_details")}

                    </Link>

                </div>

            </div>

        </div>

    );

}