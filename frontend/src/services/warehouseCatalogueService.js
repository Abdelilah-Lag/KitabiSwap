import axios from "axios";

const API = import.meta.env.VITE_API_URL?.replace(/\/+$/, "");

function apiBase() {
  return API || "http://localhost:5000";
}

function authConfig() {
  return {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  };
}

function queryToParams(query) {
  const params = {};

  if (!query) return params;

  // pagination
  if (query.page !== undefined) params.page = query.page;
  if (query.pageSize !== undefined) params.pageSize = query.pageSize;

  // search / filters (matches backend buildWhereFromQuery)
  if (query.q !== undefined) params.q = query.q;
  if (query.category !== undefined && query.category !== "") params.category = query.category;
  if (query.language !== undefined && query.language !== "") params.language = query.language;
  if (query.audience !== undefined && query.audience !== "") params.audience = query.audience;
  if (query.book_type !== undefined && query.book_type !== "") params.book_type = query.book_type;
  if (query.publisher !== undefined && query.publisher !== "") params.publisher = query.publisher;
  if (query.publication_year !== undefined && query.publication_year !== "") params.publication_year = query.publication_year;

  if (query.is_active !== undefined) params.is_active = query.is_active;

  return params;
}

export async function listCatalogue({ page, pageSize, q, category, language, audience, book_type, publisher, publication_year, is_active } = {}) {
    const response = await axios.get(
    `${apiBase()}/api/warehouse/catalogue`,
    {
      ...authConfig(),
      params: queryToParams({ page, pageSize, q, category, language, audience, book_type, publisher, publication_year, is_active })
    }
  );
  return response.data;
}

export async function createCatalogueBook({ payload, imagesFiles } = {}) {
  const formData = new FormData();

  if (payload) {
    Object.entries(payload).forEach(([k, v]) => {
      if (v === undefined || v === null || v === "") return;
      formData.append(k, v);
    });
  }

  if (imagesFiles && imagesFiles.length) {
    for (const f of imagesFiles) formData.append("images", f);
  }

  const response = await axios.post(
    `${apiBase()}/api/warehouse/catalogue`,
    formData,
    authConfig()
  );

  return response.data;
}

export async function getCatalogueBook(id) {
  const response = await axios.get(
    `${apiBase()}/api/warehouse/catalogue/${id}`,
    authConfig()
  );
  return response.data;
}

export async function updateCatalogueBook({ id, payload } = {}) {
  const response = await axios.put(
    `${apiBase()}/api/warehouse/catalogue/${id}`,
    payload || {},
    authConfig()
  );
  return response.data;
}

export async function deleteCatalogueBook(id) {
  const response = await axios.delete(
    `${apiBase()}/api/warehouse/catalogue/${id}`,
    authConfig()
  );
  return response.data;
}

export async function uploadCatalogueBookImages({ id, imagesFiles, cover_index } = {}) {
  const formData = new FormData();

  if (cover_index !== undefined && cover_index !== null && cover_index !== "") {
    formData.append("cover_index", cover_index);
  }

  if (imagesFiles && imagesFiles.length) {
    for (const f of imagesFiles) formData.append("images", f);
  }

  const response = await axios.post(
    `${apiBase()}/api/warehouse/catalogue/${id}/images`,
    formData,
    authConfig()
  );

  return response.data;
}

export async function deleteCatalogueBookImage(imageId) {
  const response = await axios.delete(
    `${apiBase()}/api/warehouse/catalogue/images/${imageId}`,
    authConfig()
  );
  return response.data;
}

