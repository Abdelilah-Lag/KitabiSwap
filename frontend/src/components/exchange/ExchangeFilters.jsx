import "./ExchangeFilters.css";
import { useTranslation } from "react-i18next";

export default function ExchangeFilters({ filters, setFilters }) {

    const { t } = useTranslation();

    function handleChange(e) {

        setFilters({

            ...filters,

            [e.target.name]: e.target.value

        });

    }

    return (

        <div className="exchange-filters">

            <input
                type="text"
                name="search"
                placeholder={t("search_book")}
                value={filters.search}
                onChange={handleChange}
            />

            <select
                name="category"
                value={filters.category}
                onChange={handleChange}
            >
                <option value="">

                    {t("all_categories")}

                </option>

                <option value="Novel">Novel</option>

                <option value="Science">Science</option>

                <option value="Computer Science">Computer Science</option>

                <option value="Business">Business</option>

            </select>

            <select
                name="language"
                value={filters.language}
                onChange={handleChange}
            >
                <option value="">

                    {t("all_languages")}

                </option>

                <option value="English">

                    English

                </option>

                <option value="French">

                    Français

                </option>

                <option value="Arabic">

                    العربية

                </option>

            </select>

            <select
                name="condition"
                value={filters.condition}
                onChange={handleChange}
            >
                <option value="">

                    {t("all_conditions")}

                </option>

                <option value="new">

                    {t("new")}

                </option>

                <option value="excellent">

                    {t("excellent")}

                </option>

                <option value="very_good">

                    {t("very_good")}

                </option>

                <option value="good">

                    {t("good")}

                </option>

                <option value="acceptable">

                    {t("acceptable")}

                </option>

            </select>

            <input
                type="text"
                name="city"
                placeholder={t("city")}
                value={filters.city}
                onChange={handleChange}
            />

            <select
                name="sort"
                value={filters.sort}
                onChange={handleChange}
            >

                <option value="newest">

                    {t("newest")}

                </option>

                <option value="oldest">

                    {t("oldest")}

                </option>

                <option value="price_asc">

                    {t("price_low_high")}

                </option>

                <option value="price_desc">

                    {t("price_high_low")}

                </option>

            </select>

        </div>

    );

}