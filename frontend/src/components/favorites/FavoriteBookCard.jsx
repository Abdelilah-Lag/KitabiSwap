import "./FavoriteBookCard.css";

import { useTranslation } from "react-i18next";

export default function FavoriteBookCard({

    book,

    onViewDetails,

    onRemove

}) {

    const { t } = useTranslation();

    const coverImage =

        book.cover_image ||

        book.coverImage ||

        book.image_url ||

        book.images?.find(image => image.is_cover)?.image_url ||

        book.images?.[0]?.image_url ||

        "/images/book-placeholder.png";

    const title =

        book.catalog?.title ||

        book.title ||

        "-";

    const author =

        book.catalog?.author ||

        book.author ||

        "-";

    const condition =

        book.condition ||

        book.book_condition ||

        "-";

    const price =

        book.price ??

        book.estimated_price ??

        "-";

    const owner =

        book.owner_name ||

        book.username ||

        "-";

    return (

        <div className="favorite-book-card">

            {/* ==========================
                IMAGE
            ========================== */}

            <div className="favorite-book-image">

                <img

                    src={coverImage}

                    alt={title}

                />

            </div>

            {/* ==========================
                CONTENT
            ========================== */}

            <div className="favorite-book-content">

                <h3>

                    {title}

                </h3>

                <p className="favorite-author">

                    {author}

                </p>

                <div className="favorite-info">

                    <span>

                         {t("condition")} :

                    </span>

                    <strong>

                        {t(condition)}

                    </strong>

                </div>

                <div className="favorite-info">

                    <span>

                         {t("price")} :

                    </span>

                    <strong>

                        {price} DH

                    </strong>

                </div>

                <div className="favorite-info">

                    <span>

                        👤 {t("owner")} :

                    </span>

                    <strong>

                        {owner}

                    </strong>

                </div>

            </div>

            {/* ==========================
                ACTIONS
            ========================== */}

            <div className="favorite-actions">

                <button

                    className="favorite-details-btn"

                    onClick={() => onViewDetails(book)}

                >

                    {t("view_details")}

                </button>

                <button

                    className="favorite-remove-btn"

                    onClick={() => onRemove(book)}

                >

                    {t("remove")}

                </button>

            </div>

        </div>

    );

}