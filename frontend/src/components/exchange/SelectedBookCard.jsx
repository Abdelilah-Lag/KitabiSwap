import "./SelectedBookCard.css";

import { useTranslation } from "react-i18next";

export default function SelectedBookCard({

    book,

    selected,

    onSelect

}) {

    const { t } = useTranslation();

    return (

        <div
            className={`selected-book-card ${selected ? "active" : ""}`}
            onClick={() => onSelect(book.id)}
        >

            <div className="selected-book-checkbox">

                <input
                    type="checkbox"
                    checked={selected}
                    onChange={() => onSelect(book.id)}
                />

            </div>

            <img

                src={book.cover || "https://placehold.co/300x420"}

                alt={book.title || "Book"}

            />

            <div className="selected-book-content">

                <h3>

                    {book.title}

                </h3>

                <p>

                    {book.author}

                </p>

                <div className="selected-book-row">

                    <span>

                        {t("condition")}

                    </span>

                    <strong>

                        {t(book.condition)}

                    </strong>

                </div>

                <div className="selected-book-row">

                    <span>

                        {t("estimated_price")}

                    </span>

                    <strong>

                        {book.estimated_price} DH

                    </strong>

                </div>

            </div>

        </div>

    );

}