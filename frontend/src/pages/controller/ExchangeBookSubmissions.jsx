import "../../components/controller/exchangeSubmissions/ControllerExchangeSubmissions.css";

import { useEffect, useMemo, useState } from "react";

import ControllerLayout from "../../components/controller/ControllerLayout";
import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import ExchangeSubmissionFilters from "../../components/controller/exchangeSubmissions/ExchangeSubmissionFilters";
import ExchangeSubmissionCard from "../../components/controller/exchangeSubmissions/ExchangeSubmissionCard";
import ExchangeSubmissionPagination from "../../components/controller/exchangeSubmissions/ExchangeSubmissionPagination";
import ExchangeSubmissionEmpty from "../../components/controller/exchangeSubmissions/ExchangeSubmissionEmpty";

import { getPendingExchangeSubmissions } from "../../services/controllerExchangeSubmissionService";

export default function ExchangeBookSubmissions() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ q: "" });

  const [page, setPage] = useState(1);
  const pageSize = 10;

  const filtered = useMemo(() => {
    const q = (filters.q || "").trim().toLowerCase();
    if (!q) return items;

    return items.filter(it => {
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
      const res = await getPendingExchangeSubmissions();
      const data = res?.data ?? [];
      setItems(data);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Erreur lors du chargement des propositions");
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
    <ControllerLayout>
      <div className="controller-exchange-submissions-page">
        <div className="controller-exchange-submissions-header">
          <div>
            <h1>Propositions de livres</h1>
            <p className="muted">En attente de validation</p>
          </div>
          <div />
        </div>

        <ExchangeSubmissionFilters filters={filters} onChange={setFilters} />

        {loading ? (
          <div className="controller-exchange-submissions-loading">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="controller-exchange-submissions-error">{error}</div>
        ) : paged.length === 0 ? (
          <ExchangeSubmissionEmpty />
        ) : (
          <div className="controller-exchange-submissions-grid">
            {paged.map(item => (
              <ExchangeSubmissionCard key={item.id} submission={item} onRefresh={load} />
            ))}
          </div>
        )}

        {!loading && !error && filtered.length > 0 && (
          <ExchangeSubmissionPagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </div>
    </ControllerLayout>
  );
}

