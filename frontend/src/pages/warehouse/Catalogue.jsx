import "./Catalogue.css";

import { useEffect, useMemo, useState } from "react";

import WarehouseLayout from "../../components/warehouse/WarehouseLayout";
import LoadingSpinner from "../../components/warehouse/common/LoadingSpinner";

import CatalogueSearch from "../../components/warehouse/catalogue/CatalogueSearch";
import CatalogueFilters from "../../components/warehouse/catalogue/CatalogueFilters";
import CatalogueTable from "../../components/warehouse/catalogue/CatalogueTable";
import CataloguePagination from "../../components/warehouse/catalogue/CataloguePagination";
import AddCatalogueBookModal from "../../components/warehouse/catalogue/AddCatalogueBookModal";

import { listCatalogue } from "../../services/warehouseCatalogueService";

export default function Catalogue() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [items, setItems] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 25,
    total: 0,
    totalPages: 0
  });

  const [filters, setFilters] = useState({
    q: "",
    category: "",
    language: "",
    audience: "",
    book_type: "",
    publisher: "",
    publication_year: "",
    is_active: "true"
  });

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const params = useMemo(() => {
    return {
      page,
      pageSize,
      ...filters
    };
  }, [page, pageSize, filters]);

  async function loadCatalogue(nextParams = params) {
    try {
      setLoading(true);
      setError(null);
      const response = await listCatalogue(nextParams);

      // backend returns: { data, pagination }
      const data = response?.data ?? [];
      const pag = response?.pagination ?? { page: nextParams.page, pageSize: nextParams.pageSize, total: data.length, totalPages: 1 };

      setItems(data);
      setPagination(pag);
    } catch (e) {
      console.error(e);
      setError(e?.message || "Erreur lors du chargement du catalogue");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadCatalogue();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, filters]);

  return (
    <WarehouseLayout>
      <div className="warehouse-catalogue-page">
        <div className="warehouse-catalogue-header">
          <div>
            <h1>Catalogue</h1>
            <p className="muted">Gérer les livres du catalogue (recherche / filtres / pagination)</p>
          </div>
          <div className="warehouse-catalogue-actions">
            <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
              Ajouter un livre
            </button>
          </div>
        </div>

        <CatalogueSearch
          value={filters.q}
          onChange={(value) => setFilters((f) => ({ ...f, q: value }))}
        />

        <CatalogueFilters
          filters={filters}
          onChange={(next) => setFilters(next)}
        />

        {loading ? (
          <div className="warehouse-catalogue-loading">
            <LoadingSpinner />
          </div>
        ) : error ? (
          <div className="warehouse-catalogue-error">{error}</div>
        ) : (
          <>
            <CatalogueTable items={items} onRefresh={() => loadCatalogue()} />
            <CataloguePagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              pageSize={pageSize}
              onPageChange={(p) => setPage(p)}
              onPageSizeChange={(s) => {
                setPageSize(s);
                setPage(1);
              }}
            />
          </>
        )}

        <AddCatalogueBookModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onCreated={() => {
            setIsModalOpen(false);
            loadCatalogue({ ...params, page: 1 });
          }}
        />
      </div>
    </WarehouseLayout>
  );
}

