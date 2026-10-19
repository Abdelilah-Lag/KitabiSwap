import "./SellBookSubmissions.css";

import { useEffect, useMemo, useState } from "react";

import WarehouseLayout from "../../components/warehouse/WarehouseLayout";
import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import SellSubmissionFilters from "../../components/warehouse/sellSubmissions/SellSubmissionFilters";
import SellSubmissionCard from "../../components/warehouse/sellSubmissions/SellSubmissionCard";
import SellSubmissionPagination from "../../components/warehouse/sellSubmissions/SellSubmissionPagination";
import SellSubmissionEmpty from "../../components/warehouse/sellSubmissions/SellSubmissionEmpty";

import {
  getPendingSellSubmissions
} from "../../services/warehouseSellSubmissionService";

export default function SellBookSubmissions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [items, setItems] = useState([]);

  const [filters, setFilters] = useState({
    q: ""
  });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = (filters.q || "").trim().toLowerCase();
    if (!q) return items;

    return items.filter(it => {
      /*
      =====================================
      LIST ENDPOINT RETURNS FLAT DATA
      =====================================
      */
      const haystack = [
        it?.id,
        it?.user?.email,
        it?.user?.first_name,
        it?.user?.last_name,
        it?.isbn,
        it?.title,
        it?.author
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(q);
    });
  }, [items, filters]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paged = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filtered.slice(start, start + pageSize);
  }, [filtered, page]);

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await getPendingSellSubmissions();
      const data = res?.data ?? [];
      setItems(data);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Erreur lors du chargement");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  return (
    <WarehouseLayout>
      <div className="sell-submissions-page">
        <div className="sell-submissions-header">
          <div>
            <h1>Propositions de vente</h1>
            <p className="muted">En attente de validation</p>
          </div>
          <div />
        </div>

        <SellSubmissionFilters
          filters={filters}
          onChange={setFilters}
        />

        {loading ? (
          <div className="sell-submissions-loading">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="sell-submissions-error">{error}</div>
        ) : paged.length === 0 ? (
          <SellSubmissionEmpty />
        ) : (
          <div className="sell-submissions-grid">
            {paged.map(item => (
              <SellSubmissionCard
                key={item.id}
                submission={item}
                onRefresh={load}
              />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <SellSubmissionPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </WarehouseLayout>
  );
}
