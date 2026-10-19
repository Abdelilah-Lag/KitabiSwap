import "./AddBookSubmission.css";

import { useState } from "react";

import { useTranslation } from "react-i18next";

import UserHeader from "../../components/user/UserHeader";
import UserFooter from "../../components/user/UserFooter";

import BookCatalogSearch from "../../components/bookSubmission/BookCatalogSearch";
import BookInformationForm from "../../components/bookSubmission/BookInformationForm";
import BookImagesUploader from "../../components/bookSubmission/BookImagesUploader";
import CoverImageSelector from "../../components/bookSubmission/CoverImageSelector";
import BookPreview from "../../components/bookSubmission/BookPreview";
import SubmitButtons from "../../components/bookSubmission/SubmitButtons";

import { createBookSubmission } from "../../services/bookSubmissionService";

export default function AddBookSubmission() {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);

    const [formData, setFormData] = useState({

        // Book info
        bookCatalogId: "",
        isbn: "",
        title: "",
        subtitle: "",
        author: "",
        publisher: "",
        edition: "",
        publicationYear: "",
        language: "",
        category: "",

        // Submission info
        bookType: "physical",
        coverType: "paperback",
        targetAudience: "all",
        pages: "",
        pagesColor: "black_white",
        dimensions: "",
        weight: "",

        requestType: "exchange",
        book_condition: "good",
        estimatedPrice: "",
        price: "",

        requestExchangeDescription: "",
        summary: "",
        description: "",
        searchKeywords: ""

    });

    const [images, setImages] = useState([]);
    const [coverIndex, setCoverIndex] = useState(0);

    const [errors, setErrors] = useState({});

    function handleSelectBook(book) {
        // Map the API book fields to this form.
        // (Keep it permissive to avoid breaking when the API shape changes.)
        setFormData((prev) => ({
            ...prev,
            bookCatalogId: book?.id || prev.bookCatalogId,
            isbn: book?.isbn || prev.isbn,
            title: book?.title || prev.title,
            subtitle: book?.subtitle || prev.subtitle,
            author: book?.author || prev.author,
            publisher: book?.publisher || prev.publisher,
            edition: book?.edition || prev.edition,
            publicationYear: book?.publicationYear || book?.publication_year || prev.publicationYear,
            language: book?.language || prev.language,
            category: book?.category || prev.category,
        }));
    }

    async function handleSubmit() {
        setLoading(true);

        try {
            const res = await createBookSubmission({
                formData,
                images,
                coverIndex
            });

            console.log("createBookSubmission response:", res);

            // Success feedback (simple, no i18n key required)
            alert(
                `Livre soumis avec succès !${res?.data?.id ? ` (ID: ${res.data.id})` : ""}`
            );
        } catch (err) {
            console.error("createBookSubmission error:", err);
            alert("Erreur lors de l'envoi de la demande. Vérifiez la console.");
        } finally {
            setLoading(false);
        }
    }

    function handleCancel() {
        // keep feature parity placeholder (existing code didn't implement cancel behavior)
        window.location.reload();
    }

    return (
        <>
            <UserHeader />

            <div className="add-book-page">
                <div className="add-book-container">
                    <div className="page-header">
                        <h1>{t("add_book")}</h1>
                        <p>{t("submit_your_book_for_exchange_or_sale")}</p>
                    </div>

                    <BookCatalogSearch onSelectBook={handleSelectBook} />

                    <BookInformationForm
                        formData={formData}
                        setFormData={setFormData}
                        errors={errors}
                    />

                    <BookImagesUploader
                        images={images}
                        setImages={setImages}
                    />

                    <CoverImageSelector
                        images={images}
                        coverIndex={coverIndex}
                        setCoverIndex={setCoverIndex}
                    />

                    <BookPreview
                        formData={formData}
                        images={images}
                        coverIndex={coverIndex}
                    />

                    <SubmitButtons
                        loading={loading}
                        onSubmit={handleSubmit}
                        onCancel={handleCancel}
                    />
                </div>
            </div>

            <UserFooter />
        </>
    );
}

