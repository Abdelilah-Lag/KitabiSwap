import "./ExchangeCard.css";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function ExchangeCard({ book }) {

    const { t } = useTranslation();

    return (

        <div className="exchange-card">

            <img

                src={book.cover}

                alt={book.title}

            />

            <div className="exchange-card-body">

                <h3>

                    {book.title}

                </h3>

                <p>

                    {book.author}

                </p>

                <div className="exchange-owner">

                    <span>

                        {t("owner")}

                    </span>

                    <strong>

                        {book.owner || book.owner_name || "Unknown"}

                    </strong>

                </div>
                <div className="exchange-owner">

                    <span>

                      {t("city")}

                    </span>

                   <strong>
                        {book.city || t("unknown_city")}
                    </strong>

                </div>

                <div className="exchange-owner">

                    <span>

                        {t("condition")}

                    </span>

                    <strong>

                        {t(book.condition)}

                    </strong>

                </div>

                <div className="exchange-owner">

                    <span>

                        {t("estimated_price")}

                    </span>

                    <strong>

                        {book.estimated_price ?? 0} DH

                    </strong>

                </div>

                <div className="exchange-buttons">

                    <Link

                        to={`/user/exchange/book/${book.id}`}

                        className="btn-outline"

                    >

                        {t("view_book")}

                    </Link>

                    <Link

                        to={`/user/exchange/request/${book.id}`}

                        className="btn-primary"

                    >

                        {t("request_exchange")}

                    </Link>

                </div>

            </div>

        </div>

    );

}