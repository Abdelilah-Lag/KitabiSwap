import { useEffect, useState } from "react";

import "./SellSubmissionDetailsModal.css";

/*
==========================================================
CATALOG ENUM OPTIONS
(match `books_catalog` table enums)
==========================================================
*/

const BOOK_TYPE_OPTIONS = [
  { value: "school",      label: "Scolaire" },
  { value: "university",  label: "Universitaire" },
  { value: "novel",       label: "Roman" },
  { value: "comic",       label: "Bande dessinée" },
  { value: "manga",       label: "Manga" },
  { value: "religious",   label: "Religieux" },
  { value: "science",     label: "Sciences" },
  { value: "technology",  label: "Technologie" },
  { value: "history",     label: "Histoire" },
  { value: "children",    label: "Enfants" },
  { value: "dictionary",  label: "Dictionnaire" },
  { value: "magazine",    label: "Magazine" },
  { value: "other",       label: "Autre" }
];

const COVER_TYPE_OPTIONS = [
  { value: "paperback", label: "Broché" },
  { value: "hardcover", label: "Rigide" },
  { value: "spiral",    label: "Spirale" },
  { value: "ebook",     label: "Numérique" },
  { value: "other",     label: "Autre" }
];

const TARGET_AUDIENCE_OPTIONS = [
  { value: "children", label: "Enfants" },
  { value: "teen",     label: "Adolescents" },
  { value: "adult",    label: "Adultes" },
  { value: "all",      label: "Tous" }
];

const PAGES_COLOR_OPTIONS = [
  { value: "black_white", label: "Noir & blanc" },
  { value: "color",       label: "Couleur" }
];

/*
==========================================================
DEFAULT FORM VALUES
==========================================================
*/

const DEFAULT_FORM = {
  isbn: "",
  title: "",
  subtitle: "",
  author: "",
  publisher: "",
  edition: "",
  publication_year: "",
  language: "Français",
  category: "",
  book_type: "other",
  cover_type: "paperback",
  target_audience: "all",
  pages: "",
  pages_color: "black_white",
  dimensions: "",
  weight: "",
  description: "",
  summary: "",
  search_keywords: ""
};

/*
==========================================================
MAP SUBMISSION -> CATALOG-COMPATIBLE FORM
Submission enums differ from catalog enums, so we
sanitize before pre-filling.
==========================================================
*/

function mapSubmissionToForm(submission, existingOverride) {
  if (!submission) return { ...DEFAULT_FORM };

  const catalogEnum = (value, options, fallback) => {
    if (!value) return fallback;
    return options.some(o => o.value === value) ? value : fallback;
  };

  const base = {
    ...DEFAULT_FORM,
    isbn:             submission.isbn             ?? "",
    title:            submission.title            ?? "",
    subtitle:         submission.subtitle         ?? "",
    author:           submission.author           ?? "",
    publisher:        submission.publisher        ?? "",
    edition:          submission.edition          ?? "",
    publication_year: submission.publication_year ?? "",
    language:         submission.language         ?? "Français",
    category:         submission.category         ?? "",
    book_type:        catalogEnum(submission.book_type,        BOOK_TYPE_OPTIONS,        "other"),
    cover_type:       catalogEnum(submission.cover_type,       COVER_TYPE_OPTIONS,       "paperback"),
    target_audience:  catalogEnum(submission.target_audience,  TARGET_AUDIENCE_OPTIONS,  "all"),
    pages:            submission.pages            ?? "",
    pages_color:      catalogEnum(submission.pages_color,      PAGES_COLOR_OPTIONS,      "black_white"),
    dimensions:       submission.dimensions       ?? "",
    weight:           submission.weight           ?? "",
    description:      submission.description      ?? "",
    summary:          submission.summary          ?? "",
    search_keywords:  submission.search_keywords  ?? ""
  };

  return { ...base, ...(existingOverride || {}) };
}

/*
==========================================================
EDIT CATALOG BOOK MODAL
==========================================================
*/

export default function EditCatalogBookModal({
  isOpen,
  onClose,
  submission,
  initialData,
  onUpdated
}) {
  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (isOpen) {
      setForm(mapSubmissionToForm(submission, initialData));
    }
  }, [isOpen, submission, initialData]);

  if (!isOpen) return null;

  function update(field, value) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function onSubmit(event) {
    event.preventDefault();

    /*
    =====================================
    NORMALIZE NUMERIC FIELDS
    =====================================
    */

    const payload = {
      ...form,
      publication_year: form.publication_year === "" ? null : Number(form.publication_year),
      pages:            form.pages            === "" ? null : Number(form.pages),
      weight:           form.weight           === "" ? null : Number(form.weight)
    };

    onUpdated?.(payload);
  }

  const alreadyInCatalog = !!submission?.book_catalog_id;

  return (
    <div className="modal-overlay">
      <div className="modal modal-lg">
        <div className="modal-header">
          <h2>Modifier les informations du livre</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {alreadyInCatalog && (
            <div style={{
              background: "#fff8e1",
              border: "1px solid #ffe082",
              padding: "10px 12px",
              borderRadius: 6,
              marginBottom: 12
            }}>
              Ce livre existe déjà dans le catalogue. Les modifications ne seront
              pas insérées dans <code>books_catalog</code> ; le livre existant sera réutilisé.
            </div>
          )}

          <form className="edit-catalog-form" onSubmit={onSubmit}>
            <div className="form-grid" style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12
            }}>
              <label>
                ISBN
                <input
                  type="text"
                  value={form.isbn ?? ""}
                  onChange={e => update("isbn", e.target.value)}
                />
              </label>

              <label>
                Titre *
                <input
                  type="text"
                  required
                  value={form.title ?? ""}
                  onChange={e => update("title", e.target.value)}
                />
              </label>

              <label>
                Sous-titre
                <input
                  type="text"
                  value={form.subtitle ?? ""}
                  onChange={e => update("subtitle", e.target.value)}
                />
              </label>

              <label>
                Auteur *
                <input
                  type="text"
                  required
                  value={form.author ?? ""}
                  onChange={e => update("author", e.target.value)}
                />
              </label>

              <label>
                Éditeur
                <input
                  type="text"
                  value={form.publisher ?? ""}
                  onChange={e => update("publisher", e.target.value)}
                />
              </label>

              <label>
                Édition
                <input
                  type="text"
                  value={form.edition ?? ""}
                  onChange={e => update("edition", e.target.value)}
                />
              </label>

              <label>
                Année de publication
                <input
                  type="number"
                  min="1000"
                  max="2100"
                  value={form.publication_year ?? ""}
                  onChange={e => update("publication_year", e.target.value)}
                />
              </label>

              <label>
                Langue
                <input
                  type="text"
                  value={form.language ?? ""}
                  onChange={e => update("language", e.target.value)}
                />
              </label>

              <label>
                Catégorie
                <input
                  type="text"
                  value={form.category ?? ""}
                  onChange={e => update("category", e.target.value)}
                />
              </label>

              <label>
                Type de livre
                <select
                  value={form.book_type}
                  onChange={e => update("book_type", e.target.value)}
                >
                  {BOOK_TYPE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>

              <label>
                Type de couverture
                <select
                  value={form.cover_type}
                  onChange={e => update("cover_type", e.target.value)}
                >
                  {COVER_TYPE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>

              <label>
                Public cible
                <select
                  value={form.target_audience}
                  onChange={e => update("target_audience", e.target.value)}
                >
                  {TARGET_AUDIENCE_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>

              <label>
                Pages
                <input
                  type="number"
                  min="0"
                  value={form.pages ?? ""}
                  onChange={e => update("pages", e.target.value)}
                />
              </label>

              <label>
                Couleur des pages
                <select
                  value={form.pages_color}
                  onChange={e => update("pages_color", e.target.value)}
                >
                  {PAGES_COLOR_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
              </label>

              <label>
                Dimensions
                <input
                  type="text"
                  value={form.dimensions ?? ""}
                  onChange={e => update("dimensions", e.target.value)}
                />
              </label>

              <label>
                Poids (g)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={form.weight ?? ""}
                  onChange={e => update("weight", e.target.value)}
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                Mots-clés
                <input
                  type="text"
                  value={form.search_keywords ?? ""}
                  onChange={e => update("search_keywords", e.target.value)}
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                Résumé
                <textarea
                  rows={3}
                  value={form.summary ?? ""}
                  onChange={e => update("summary", e.target.value)}
                />
              </label>

              <label style={{ gridColumn: "1 / -1" }}>
                Description
                <textarea
                  rows={4}
                  value={form.description ?? ""}
                  onChange={e => update("description", e.target.value)}
                />
              </label>
            </div>

            <div className="modal-actions" style={{ marginTop: 16 }}>
              <button type="button" className="btn" onClick={onClose}>
                Annuler
              </button>
              <button type="submit" className="btn btn-primary">
                Enregistrer les modifications
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
