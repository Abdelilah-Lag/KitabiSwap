import "./BookInformationForm.css";

import { useTranslation } from "react-i18next";

export default function BookInformationForm({

    formData,
    setFormData

}) {

    const { t } = useTranslation();

    function handleChange(event) {

        const { name, value } = event.target;

        setFormData((previous) => ({

            ...previous,

            [name]: value

        }));

    }

    return (

        <section className="submission-section">

            <div className="section-header">

                <h2>{t("book_information")}</h2>

                <p>{t("fill_book_information")}</p>

            </div>

            <div className="submission-form">

                <div className="form-group">

                    <label>{t("isbn")}</label>

                    <input

                        type="text"

                        name="isbn"

                        value={formData.isbn}

                        onChange={handleChange}

                        placeholder={t("isbn")}

                    />

                </div>

                <div className="form-group">

                    <label>

                        {t("title")} *

                    </label>

                    <input

                        type="text"

                        name="title"

                        value={formData.title}

                        onChange={handleChange}

                        placeholder={t("title")}

                        required

                    />

                </div>

                <div className="form-group">

                    <label>{t("subtitle")}</label>

                    <input

                        type="text"

                        name="subtitle"

                        value={formData.subtitle}

                        onChange={handleChange}

                        placeholder={t("subtitle")}

                    />

                </div>

                <div className="form-group">

                    <label>

                        {t("author")} *

                    </label>

                    <input

                        type="text"

                        name="author"

                        value={formData.author}

                        onChange={handleChange}

                        placeholder={t("author")}

                        required

                    />

                </div>

                <div className="form-group">

                    <label>{t("publisher")}</label>

                    <input

                        type="text"

                        name="publisher"

                        value={formData.publisher}

                        onChange={handleChange}

                        placeholder={t("publisher")}

                    />

                </div>

                <div className="form-group">

                    <label>{t("edition")}</label>

                    <input

                        type="text"

                        name="edition"

                        value={formData.edition}

                        onChange={handleChange}

                        placeholder={t("edition")}

                    />

                </div>

                <div className="form-group">

                    <label>{t("publication_year")}</label>

                    <input

                        type="number"

                        name="publicationYear"

                        value={formData.publicationYear}

                        onChange={handleChange}

                        placeholder="2025"

                        min="1000"

                        max="2100"

                    />

                </div>

                <div className="form-group">

                    <label>{t("language")}</label>

                    <input

                        type="text"

                        name="language"

                        value={formData.language}

                        onChange={handleChange}

                        placeholder={t("language")}

                    />

                </div>

                <div className="form-group">

                    <label>{t("category")}</label>

                    <input

                        type="text"

                        name="category"

                        value={formData.category}

                        onChange={handleChange}

                        placeholder={t("category")}

                    />

                </div>

                <div className="form-group">

                    <label>{t("book_type")}</label>

                    <select

                        name="bookType"

                        value={formData.bookType}

                        onChange={handleChange}

                    >

                        <option value="physical">{t("physical")}</option>

                        <option value="ebook">{t("ebook")}</option>

                        <option value="audiobook">{t("audiobook")}</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>{t("cover_type")}</label>

                    <select

                        name="coverType"

                        value={formData.coverType}

                        onChange={handleChange}

                    >

                        <option value="paperback">{t("paperback")}</option>

                        <option value="hardcover">{t("hardcover")}</option>

                        <option value="spiral">{t("spiral")}</option>

                        <option value="other">{t("other")}</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>{t("target_audience")}</label>

                    <select

                        name="targetAudience"

                        value={formData.targetAudience}

                        onChange={handleChange}

                    >

                        <option value="children">{t("children")}</option>

                        <option value="teen">{t("teen")}</option>

                        <option value="adult">{t("adult")}</option>

                        <option value="all">{t("all")}</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>{t("pages")}</label>

                    <input

                        type="number"

                        name="pages"

                        value={formData.pages}

                        onChange={handleChange}

                        placeholder="250"

                        min="1"

                    />

                </div>

                <div className="form-group">

                    <label>{t("pages_color")}</label>

                    <select

                        name="pagesColor"

                        value={formData.pagesColor}

                        onChange={handleChange}

                    >

                        <option value="black_white">{t("black_white")}</option>

                        <option value="color">{t("color")}</option>

                        <option value="mixed">{t("mixed")}</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>{t("dimensions")}</label>

                    <input

                        type="text"

                        name="dimensions"

                        value={formData.dimensions}

                        onChange={handleChange}

                        placeholder="24 × 17 × 2 cm"

                    />

                </div>

                <div className="form-group">

                    <label>{t("weight")}</label>

                    <input

                        type="number"

                        name="weight"

                        value={formData.weight}

                        onChange={handleChange}

                        placeholder="500"

                        min="0"

                        step="0.01"

                    />

                </div>

                <div className="form-group">

                    <label>

                        {t("book_condition")} *

                    </label>

                    <select

                        name="condition"

                        value={formData.book_condition}

                        onChange={handleChange}

                        required

                    >

                        <option value="new">{t("new")}</option>

                        <option value="like_new">{t("like_new")}</option>

                        <option value="very_good">{t("very_good")}</option>

                        <option value="good">{t("good")}</option>

                        <option value="acceptable">{t("acceptable")}</option>

                        <option value="poor">{t("poor")}</option>

                    </select>

                </div>

                <div className="form-group">

                    <label>{t("price")}</label>

                    <input

                        type="number"

                        name="price"

                        value={formData.price}

                        onChange={handleChange}

                        placeholder="0.00"

                        min="0"

                        step="0.01"

                    />

                </div>

                <div className="form-group">

                    <label>{t("estimated_price")}</label>

                    <input

                        type="number"

                        name="estimatedPrice"

                        value={formData.estimatedPrice}

                        onChange={handleChange}

                        placeholder="0.00"

                        min="0"

                        step="0.01"

                    />

                </div>

                <div className="form-group">

                    <label>

                        {t("request_type")} *

                    </label>

                    <select

                        name="requestType"

                        value={formData.requestType}

                        onChange={handleChange}

                        required

                    >

                        <option value="exchange">{t("exchange")}</option>

                        <option value="sell">{t("sell")}</option>

                    </select>

                </div>

                {formData.requestType === "exchange" && (

                    <div className="form-group full-width">

                        <label>{t("request_exchange_description")}</label>

                        <textarea

                            name="requestExchangeDescription"

                            value={formData.requestExchangeDescription}

                            onChange={handleChange}

                            rows={4}

                            placeholder={t("request_exchange_description")}

                        />

                    </div>

                )}

                <div className="form-group full-width">

                    <label>{t("summary")}</label>

                    <textarea

                        name="summary"

                        value={formData.summary}

                        onChange={handleChange}

                        rows={4}

                        placeholder={t("summary")}

                    />

                </div>

                <div className="form-group full-width">

                    <label>{t("description")}</label>

                    <textarea

                        name="description"

                        value={formData.description}

                        onChange={handleChange}

                        rows={6}

                        placeholder={t("description")}

                    />

                </div>

                <div className="form-group full-width">

                    <label>{t("search_keywords")}</label>

                    <input

                        type="text"

                        name="searchKeywords"

                        value={formData.searchKeywords}

                        onChange={handleChange}

                        placeholder="React, JavaScript, Programmation..."

                    />

                    <small>{t("search_keywords_help")}</small>

                </div>

            </div>

        </section>

    );

}

