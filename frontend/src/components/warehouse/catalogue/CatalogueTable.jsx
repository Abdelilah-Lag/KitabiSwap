import { useMemo } from "react";
import "./CatalogueTable.css";

function safe(v) {
  return v === undefined || v === null ? "" : String(v);
}

export default function CatalogueTable({
  items,
  onRefresh
}) {
  const rows = useMemo(() => items || [], [items]);

  return (
    <div className="warehouse-catalogue-table-wrapper">
      <table className="warehouse-catalogue-table">
        <thead>
          <tr>
            <th>Couverture</th>
            <th>Titre</th>
            <th>Auteur</th>
            <th>Catégorie</th>
            <th>Année</th>
            <th>Used</th>
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={6} className="warehouse-catalogue-empty">
                Aucun livre trouvé.
              </td>
            </tr>
          ) : (
            rows.map((b) => (
              <tr key={b.id}>
                <td>
                  {b.cover?.image_url ? (
                    <img className="warehouse-catalogue-cover" src={b.cover.image_url} alt={b.title || "cover"} />
                  ) : (
                    <div className="warehouse-catalogue-cover-placeholder" />
                  )}
                </td>
                <td className="warehouse-catalogue-title">
                  {safe(b.title)}
                </td>
                <td>{safe(b.author)}</td>
                <td>{safe(b.category)}</td>
                <td>{safe(b.publication_year)}</td>
                <td>{safe(b.used_count)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className="warehouse-catalogue-table-footer">
        <button className="btn-secondary" onClick={onRefresh}>
          Rafraîchir
        </button>
      </div>
    </div>
  );
}

