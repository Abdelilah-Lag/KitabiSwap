import "./MyBooksTabs.css";

import { useTranslation } from "react-i18next";

export default function MyBooksTabs({

    activeTab,

    setActiveTab,

    submissionsCount,

    exchangeCount,

    saleCount

}){

    const { t } = useTranslation();

    return(

        <div className="my-books-tabs">

            <button

                className={

                    activeTab === "submissions"

                        ? "tab-button active"

                        : "tab-button"

                }

                onClick={() =>

                    setActiveTab("submissions")

                }

            >

                <span className="tab-icon">

                    

                </span>

                <span>

                    {t("book_submissions")}

                </span>

                <span className="tab-count">

                    {submissionsCount}

                </span>

            </button>

            <button

                className={

                    activeTab === "exchange"

                        ? "tab-button active"

                        : "tab-button"

                }

                onClick={() =>

                    setActiveTab("exchange")

                }

            >

                <span className="tab-icon">

                    

                </span>

                <span>

                    {t("exchange_books")}

                </span>

                <span className="tab-count">

                    {exchangeCount}

                </span>

            </button>

            <button

                className={

                    activeTab === "sale"

                        ? "tab-button active"

                        : "tab-button"

                }

                onClick={() =>

                    setActiveTab("sale")

                }

            >

                <span className="tab-icon">

                    

                </span>

                <span>

                    {t("books_for_sale")}

                </span>

                <span className="tab-count">

                    {saleCount}

                </span>

            </button>

        </div>

    );

}