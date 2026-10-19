import "./ExchangeSubmissionFilters.css";

export default function ExchangeSubmissionFilters({ filters, onChange }) {
  return (
    <div className="exchange-submission-filters">
      <input
        type="text"
        value={filters.q}
        placeholder="Rechercher (ISBN, titre, auteur, email...)"
        onChange={(e) => onChange({ ...filters, q: e.target.value })}
      />
    </div>
  );
}

