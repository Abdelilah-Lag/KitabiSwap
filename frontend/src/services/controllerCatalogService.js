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

  if (query.page !== undefined) params.page = query.page;
  if (query.pageSize !== undefined) params.pageSize = query.pageSize;

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

export async function listCatalogue({
  page,
  pageSize,
  q,
  category,
  language,
  audience,
  book_type,
  publisher,
  publication_year,
  is_active
} = {}) {
  const response = await axios.get(
    `${apiBase()}/api/controller/catalogue`,
    {
      ...authConfig(),
      params: queryToParams({
        page,
        pageSize,
        q,
        category,
        language,
        audience,
        book_type,
        publisher,
        publication_year,
        is_active
      })
    }
  );
  return response.data;
}

// CRUD images/modal are currently handled by the existing warehouse modal service.
// To keep backend logic identical (same service + same image behavior), we will later
// update the modal to use this service endpoint.

