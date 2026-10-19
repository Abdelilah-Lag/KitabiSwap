import { useEffect, useMemo, useState } from "react";

import "./AddCatalogueBookModal.css";

import UploadCover from "./UploadCover";

import {
    createCatalogueBook
} from "../../../services/warehouseCatalogueService";

/* ==========================================================
    OPTIONS
========================================================== */

const BOOK_TYPES = [
    { value: "school", label: "School Book" },
    { value: "university", label: "University Book" },
    { value: "novel", label: "Novel" },
    { value: "comic", label: "Comic" },
    { value: "manga", label: "Manga" },
    { value: "religious", label: "Religious" },
    { value: "science", label: "Science" },
    { value: "technology", label: "Technology" },
    { value: "history", label: "History" },
    { value: "children", label: "Children" },
    { value: "dictionary", label: "Dictionary" },
    { value: "magazine", label: "Magazine" },
    { value: "other", label: "Other" }
];

const COVER_TYPES = [
    { value: "paperback", label: "Paperback" },
    { value: "hardcover", label: "Hardcover" },
    { value: "spiral", label: "Spiral" },
    { value: "ebook", label: "E-Book" },
    { value: "other", label: "Other" }
];

const TARGETS = [
    { value: "children", label: "Children" },
    { value: "teen", label: "Teen" },
    { value: "adult", label: "Adult" },
    { value: "all", label: "Everyone" }
];

const PAGE_COLORS = [
    { value: "black_white", label: "Black & White" },
    { value: "color", label: "Color" }
];

const LANGUAGES = [
    "Français",
    "English",
    "العربية",
    "Español",
    "Deutsch",
    "Italiano"
];

const CATEGORIES = [
    "Literature",
    "Science",
    "Technology",
    "Computer Science",
    "Programming",
    "History",
    "Religion",
    "Business",
    "Economics",
    "Medicine",
    "Law",
    "Mathematics",
    "Education",
    "Children",
    "Fantasy",
    "Adventure",
    "Romance",
    "Thriller",
    "Horror",
    "Biography",
    "Magazine",
    "Comics",
    "Other"
];

/* ==========================================================
    COMPONENT
========================================================== */

export default function AddCatalogueBookModal({

    isOpen,

    onClose,

    onCreated

}) {

    const [submitting, setSubmitting] = useState(false);

    const [error, setError] = useState(null);

    const [imagesFiles, setImagesFiles] = useState([]);

    const [payload, setPayload] = useState({

        isbn: "",

        title: "",

        subtitle: "",

        author: "",

        publisher: "",

        edition: "",

        publication_year: "",

        language: "Français",

        category: "Literature",

        book_type: "other",

        cover_type: "paperback",

        target_audience: "all",

        pages: "",

        pages_color: "black_white",

        dimensions: "",

        weight: "",

        description: "",

        summary: "",

        search_keywords: "",

        average_rating: 0,

        total_reviews: 0,

        total_views: 0,

        is_active: true

    });

    useEffect(() => {

        if (!isOpen) {

            setSubmitting(false);

            setError(null);

            setImagesFiles([]);

            setPayload({

                isbn: "",

                title: "",

                subtitle: "",

                author: "",

                publisher: "",

                edition: "",

                publication_year: "",

                language: "Français",

                category: "Literature",

                book_type: "other",

                cover_type: "paperback",

                target_audience: "all",

                pages: "",

                pages_color: "black_white",

                dimensions: "",

                weight: "",

                description: "",

                summary: "",

                search_keywords: "",

                average_rating: 0,

                total_reviews: 0,

                total_views: 0,

                is_active: true

            });

        }

    }, [isOpen]);

    const canSubmit = useMemo(() => {

        return (

            payload.title.trim() !== "" &&

            payload.author.trim() !== "" &&

            imagesFiles.length > 0

        );

    }, [

        payload.title,

        payload.author,

        imagesFiles

    ]);

    function handleChange(e) {

        const { name, value } = e.target;

        setPayload((prev) => ({

            ...prev,

            [name]: value

        }));

    }

    async function handleSubmit(e) {

        e.preventDefault();

        if (!canSubmit || submitting) return;

        try {

            setSubmitting(true);

            setError(null);

            const response = await createCatalogueBook({

                payload,

                imagesFiles

            });

            if (response?.success === false) {

                throw new Error(response.message);

            }

            onCreated?.(response.data);

        }

        catch (err) {

            console.error(err);

            setError(

                err.message ||

                "Erreur lors de la création."

            );

        }

        finally {

            setSubmitting(false);

        }

    }

    if (!isOpen) return null;
    return (
    <div
        className="warehouse-modal-overlay"
        onMouseDown={onClose}
    >

        <div
            className="warehouse-modal"
            onMouseDown={(e) => e.stopPropagation()}
        >

            <div className="warehouse-modal-header">

                <div>

                    <h2>Ajouter un livre au catalogue</h2>

                    <p className="muted">

                        Les champs marqués (*) sont obligatoires.

                    </p>

                </div>

                <button
                    type="button"
                    className="warehouse-modal-close"
                    onClick={onClose}
                >
                    ✕

                </button>

            </div>

            {error && (

                <div className="warehouse-modal-error">

                    {error}

                </div>

            )}

            <form
                className="warehouse-modal-form"
                onSubmit={handleSubmit}
            >

                <div className="warehouse-modal-grid">

                    <label>

                        <span>Titre *</span>

                        <input
                            name="title"
                            value={payload.title}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>Auteur *</span>

                        <input
                            name="author"
                            value={payload.author}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>Sous-titre</span>

                        <input
                            name="subtitle"
                            value={payload.subtitle}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>ISBN</span>

                        <input
                            name="isbn"
                            value={payload.isbn}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>Éditeur</span>

                        <input
                            name="publisher"
                            value={payload.publisher}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>Édition</span>

                        <input
                            name="edition"
                            value={payload.edition}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>Année</span>

                        <input
                            type="number"
                            min="1900"
                            max="2100"
                            name="publication_year"
                            value={payload.publication_year}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>Langue</span>

                        <select
                            name="language"
                            value={payload.language}
                            onChange={handleChange}
                        >

                            {LANGUAGES.map(language => (

                                <option
                                    key={language}
                                    value={language}
                                >

                                    {language}

                                </option>

                            ))}

                        </select>

                    </label>

                    <label>

                        <span>Catégorie</span>

                        <select
                            name="category"
                            value={payload.category}
                            onChange={handleChange}
                        >

                            {CATEGORIES.map(category => (

                                <option
                                    key={category}
                                    value={category}
                                >

                                    {category}

                                </option>

                            ))}

                        </select>

                    </label>

                    <label>

                        <span>Type de livre</span>

                        <select
                            name="book_type"
                            value={payload.book_type}
                            onChange={handleChange}
                        >

                            {BOOK_TYPES.map(type => (

                                <option
                                    key={type.value}
                                    value={type.value}
                                >

                                    {type.label}

                                </option>

                            ))}

                        </select>

                    </label>

                    <label>

                        <span>Type de couverture</span>

                        <select
                            name="cover_type"
                            value={payload.cover_type}
                            onChange={handleChange}
                        >

                            {COVER_TYPES.map(type => (

                                <option
                                    key={type.value}
                                    value={type.value}
                                >

                                    {type.label}

                                </option>

                            ))}

                        </select>

                    </label>

                    <label>

                        <span>Public cible</span>

                        <select
                            name="target_audience"
                            value={payload.target_audience}
                            onChange={handleChange}
                        >

                            {TARGETS.map(target => (

                                <option
                                    key={target.value}
                                    value={target.value}
                                >

                                    {target.label}

                                </option>

                            ))}

                        </select>

                    </label>

                    <label>

                        <span>Nombre de pages</span>

                        <input
                            type="number"
                            name="pages"
                            value={payload.pages}
                            onChange={handleChange}
                        />

                    </label>

                    <label>

                        <span>Couleur des pages</span>

                        <select
                            name="pages_color"
                            value={payload.pages_color}
                            onChange={handleChange}
                        >

                            {PAGE_COLORS.map(color => (

                                <option
                                    key={color.value}
                                    value={color.value}
                                >

                                    {color.label}

                                </option>

                            ))}

                        </select>

                    </label>

                    <label>

                        <span>Dimensions</span>

                        <input
                            name="dimensions"
                            value={payload.dimensions}
                            onChange={handleChange}
                            placeholder="21 x 14 cm"
                        />

                    </label>

                    <label>

                        <span>Poids (g)</span>

                        <input
                            type="number"
                            name="weight"
                            value={payload.weight}
                            onChange={handleChange}
                        />

                    </label>

                </div>

                <label>

                    <span>Description</span>

                    <textarea
                        rows="4"
                        name="description"
                        value={payload.description}
                        onChange={handleChange}
                    />

                </label>

                <label>

                    <span>Résumé</span>

                    <textarea
                        rows="4"
                        name="summary"
                        value={payload.summary}
                        onChange={handleChange}
                    />

                </label>

                <label>

                    <span>Mots clés</span>

                    <textarea
                        rows="2"
                        name="search_keywords"
                        value={payload.search_keywords}
                        onChange={handleChange}
                        placeholder="roman, magie, aventure..."
                    />

                </label>
                                <div className="warehouse-book-status">

                    <label>

                        <span>Livre actif</span>

                        <select
                            name="is_active"
                            value={String(payload.is_active)}
                            onChange={(e) =>
                                setPayload({

                                    ...payload,

                                    is_active:
                                        e.target.value === "true"

                                })
                            }
                        >

                            <option value="true">

                                Oui

                            </option>

                            <option value="false">

                                Non

                            </option>

                        </select>

                    </label>

                </div>

                <UploadCover

                    files={imagesFiles}

                    onFilesChange={setImagesFiles}

                />

                <div className="warehouse-modal-actions">

                    <button

                        type="button"

                        className="btn-secondary"

                        onClick={onClose}

                    >

                        Annuler

                    </button>

                    <button

                        type="submit"

                        className="btn-primary"

                        disabled={!canSubmit || submitting}

                    >

                        {

                            submitting

                                ? "Création..."

                                : "Ajouter au catalogue"

                        }

                    </button>

                </div>

            </form>

        </div>

    </div>

);
}