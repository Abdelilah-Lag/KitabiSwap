import "./EmptyBooks.css";

import { Link } from "react-router-dom";

import { useTranslation } from "react-i18next";

export default function EmptyBooks({

    title,

    description,

    buttonText,

    buttonLink = "/user/book-submission/add"

}){

    const { t } = useTranslation();

    return(

        <div className="empty-books">

            <div className="empty-books-icon">

                📚

            </div>

            <h2>

                {title || t("no_books_found")}

            </h2>

            <p>

                {

                    description ||

                    t("you_have_no_books_yet")

                }

            </p>

            <Link

                to={buttonLink}

                className="empty-books-btn"

            >

                {buttonText || t("add_book")}

            </Link>

        </div>

    );

}