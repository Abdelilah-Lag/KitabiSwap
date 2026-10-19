import "./SellSubmissionFilters.css";

export default function SellSubmissionFilters({ filters, onChange }) {
  return (
    <div className="sell-submission-filters">
      <input
        type="text"
        value={filters.q}
        placeholder="Rechercher (ISBN, titre, auteur, email...)"
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
      />
    </div>
  );
}

