import "./CatalogueSearch.css";

export default function CatalogueSearch({
  value,
  onChange
}) {
  return (
    <div className="warehouse-catalogue-search">
      <input
        className="warehouse-catalogue-search-input"
        type="text"
        placeholder="Rechercher (titre, auteur, isbn...)"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      />
      <div className="warehouse-catalogue-search-hint">Astuce : utilisez les filtres pour affiner</div>
    </div>
  );
}

