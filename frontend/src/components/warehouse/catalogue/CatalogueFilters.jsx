import "./CatalogueFilters.css";

export default function CatalogueFilters({
  filters,
  onChange
}) {
  return (
    <div className="warehouse-catalogue-filters">
      <div className="warehouse-catalogue-filters-grid">
        <label>
          <span>Catégorie</span>
          <input
            type="text"
            value={filters.category || ""}
            onChange={(e) => onChange({ ...filters, category: e.target.value })}
          />
        </label>

        <label>
          <span>Langue</span>
          <input
            type="text"
            value={filters.language || ""}
            onChange={(e) => onChange({ ...filters, language: e.target.value })}
          />
        </label>

        <label>
          <span>Public</span>
          <input
            type="text"
            value={filters.audience || ""}
            onChange={(e) => onChange({ ...filters, audience: e.target.value })}
          />
        </label>

        <label>
          <span>Type</span>
          <input
            type="text"
            value={filters.book_type || ""}
            onChange={(e) => onChange({ ...filters, book_type: e.target.value })}
          />
        </label>

        <label>
          <span>Éditeur</span>
          <input
            type="text"
            value={filters.publisher || ""}
            onChange={(e) => onChange({ ...filters, publisher: e.target.value })}
          />
        </label>

        <label>
          <span>Année publication</span>
          <input
            type="number"
            value={filters.publication_year || ""}
            onChange={(e) => onChange({ ...filters, publication_year: e.target.value })}
          />
        </label>

        <label className="warehouse-catalogue-switch">
          <span>Actif</span>
          <select
            value={filters.is_active}
            onChange={(e) => onChange({ ...filters, is_active: e.target.value })}
          >
            <option value="true">Oui</option>
            <option value="false">Non</option>
          </select>
        </label>
      </div>

      <div className="warehouse-catalogue-filters-actions">
        <button
          className="btn-secondary"
          onClick={() => onChange({
            ...filters,
            q: "",
            category: "",
            language: "",
            audience: "",
            book_type: "",
            publisher: "",
            publication_year: "",
            is_active: "true"
          })}
        >
          Réinitialiser
        </button>
      </div>
    </div>
  );
}

