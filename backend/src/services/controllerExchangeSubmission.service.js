import prisma from "../config/prisma.js";
import { randomUUID } from "crypto";

import {
  convertConditionForUserBookToSell,
  convertPagesColorForCatalog
} from "../validations/warehouseSellSubmission.validation.js";

import { destroySubmissionImagesCloudinary } from "../utils/warehouseSellSubmission.cloudinary.js";
import { uploadToCloudinary } from "../utils/cloudinaryUpload.js";

import CLOUDINARY_FOLDERS from "../constants/cloudinaryFolders.js";

import { serializeBigInt } from "../utils/serializeBigInt.js";

/*
==========================================================
CATALOG ENUM WHITELISTS
(match `books_catalog` table enums, which differ from
`book_submissions` enums)
==========================================================
*/

const CATALOG_BOOK_TYPES = [
  "school", "university", "novel", "comic", "manga",
  "religious", "science", "technology", "history",
  "children", "dictionary", "magazine", "other"
];

const CATALOG_COVER_TYPES = [
  "paperback", "hardcover", "spiral", "ebook", "other"
];

const CATALOG_TARGET_AUDIENCES = [
  "children", "teen", "adult", "all"
];

const CATALOG_PAGES_COLORS = [
  "black_white", "color"
];

function pickEnum(value, allowed, fallback) {
  return value && allowed.includes(value) ? value : fallback;
}

/*
==========================================================
PRIVATE HELPERS
==========================================================
*/

async function getSubmissionWithDetails(id) {
  return await prisma.book_submissions.findUnique({
    where: { id: BigInt(id) },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          avatar_url: true
        }
      },
      books_catalog: true,
      book_submission_images: {
        orderBy: { sort_order: "asc" }
      }
    }
  });
}

function requireSubmission(submission) {
  if (!submission) {
    throw new Error("Proposition introuvable");
  }
  return submission;
}

/*
==========================================================
LIST PENDING EXCHANGE SUBMISSIONS
==========================================================
*/

export async function listPendingExchangeSubmissions() {
  const submissions = await prisma.book_submissions.findMany({
    where: {
      request_type: "exchange",
      status: "pending"
    },
    include: {
      users: {
        select: {
          id: true,
          first_name: true,
          last_name: true,
          email: true,
          phone: true,
          avatar_url: true
        }
      },
      books_catalog: {
        select: {
          id: true,
          isbn: true,
          title: true
        }
      },
      book_submission_images: {
        orderBy: { sort_order: "asc" }
      }
    },
    orderBy: { created_at: "desc" }
  });

  const result = submissions.map((submission) => {
    const cover =
      submission.book_submission_images.find(image => image.is_cover) ||
      submission.book_submission_images[0] ||
      null;

    return {
      id: submission.id,
      created_at: submission.created_at,
      updated_at: submission.updated_at,
      status: submission.status,
      request_type: submission.request_type,
      book_catalog_id: submission.book_catalog_id,
      catalog_exists: !!submission.book_catalog_id,
      user: submission.users,
      isbn: submission.isbn,
      title: submission.title,
      subtitle: submission.subtitle,
      author: submission.author,
      publisher: submission.publisher,
      edition: submission.edition,
      publication_year: submission.publication_year,
      language: submission.language,
      category: submission.category,
      book_type: submission.book_type,
      cover_type: submission.cover_type,
      target_audience: submission.target_audience,
      pages: submission.pages,
      pages_color: submission.pages_color,
      dimensions: submission.dimensions,
      weight: submission.weight,
      description: submission.description,
      summary: submission.summary,
      average_rating: submission.average_rating,
      search_keywords: submission.search_keywords,
      book_condition: submission.book_condition,
      estimated_price: submission.estimated_price,
      price: submission.price,
      cover_image: cover,
      images: submission.book_submission_images
    };
  });

  return serializeBigInt(result);
}

/*
==========================================================
GET SUBMISSION DETAILS
==========================================================
*/

export async function getExchangeSubmissionDetails(id) {
  const submission = requireSubmission(await getSubmissionWithDetails(id));

  const cover =
    submission.book_submission_images.find(image => image.is_cover) ||
    submission.book_submission_images[0] ||
    null;

  const result = {
    id: submission.id,
    created_at: submission.created_at,
    updated_at: submission.updated_at,
    status: submission.status,
    request_type: submission.request_type,

    user: {
      id: submission.users.id,
      first_name: submission.users.first_name,
      last_name: submission.users.last_name,
      email: submission.users.email,
      phone: submission.users.phone,
      avatar_url: submission.users.avatar_url
    },

    catalog: {
      exists: !!submission.book_catalog_id,
      book_catalog_id: submission.book_catalog_id,
      book: submission.books_catalog
    },

    book: {
      isbn: submission.isbn,
      title: submission.title,
      subtitle: submission.subtitle,
      author: submission.author,
      publisher: submission.publisher,
      edition: submission.edition,
      publication_year: submission.publication_year,
      language: submission.language,
      category: submission.category,
      book_type: submission.book_type,
      cover_type: submission.cover_type,
      target_audience: submission.target_audience,
      pages: submission.pages,
      pages_color: submission.pages_color,
      dimensions: submission.dimensions,
      weight: submission.weight,
      description: submission.description,
      summary: submission.summary,
      search_keywords: submission.search_keywords
    },

    sale: {
      book_condition: submission.book_condition,
      estimated_price: submission.estimated_price,
      price: submission.price
    },

    images: {
      cover,
      gallery: submission.book_submission_images
    }
  };

  return serializeBigInt(result);
}

/*
==========================================================
BUILD CATALOG DATA
==========================================================
*/

function buildCatalogData(submission, catalogOverride) {
  const src = { ...submission, ...(catalogOverride || {}) };

  return {
    uuid: randomUUID(),
    isbn: src.isbn ?? null,
    title: src.title,
    subtitle: src.subtitle ?? null,
    author: src.author,
    publisher: src.publisher ?? null,
    edition: src.edition ?? null,
    publication_year: src.publication_year ?? null,
    language: src.language ?? "Français",
    category: src.category ?? null,
    book_type: pickEnum(src.book_type, CATALOG_BOOK_TYPES, "other"),
    cover_type: pickEnum(src.cover_type, CATALOG_COVER_TYPES, "paperback"),
    target_audience: pickEnum(src.target_audience, CATALOG_TARGET_AUDIENCES, "all"),
    pages: src.pages ?? null,
    pages_color: catalogOverride?.pages_color
      ? pickEnum(catalogOverride.pages_color, CATALOG_PAGES_COLORS, "black_white")
      : convertPagesColorForCatalog(src.pages_color),
    dimensions: src.dimensions ?? null,
    weight: src.weight ?? null,
    description: src.description ?? null,
    summary: src.summary ?? null,
    average_rating: src.average_rating ?? 0,
    search_keywords: src.search_keywords ?? null,
    is_active: true
  };
}

/*
==========================================================
CREATE BOOK IN CATALOG
==========================================================
*/

async function createCatalogBookFromSubmission({ submission, catalogOverride, tx }) {
  const data = buildCatalogData(submission, catalogOverride);
  const createdBook = await tx.books_catalog.create({ data });
  return createdBook;
}

/*
==========================================================
GET OR CREATE CATALOG BOOK
==========================================================
*/

async function getOrCreateCatalogBook({ submission, catalogOverride, tx }) {
  // If already linked, reuse.
  if (submission.book_catalog_id) {
    return submission.book_catalog_id;
  }

  // Normalize ISBN
  const isbn = submission.isbn
    ? submission.isbn.replace(/[-\s]/g, "").trim()
    : null;

  // By ISBN
  if (isbn) {
    const existingBook = await tx.books_catalog.findUnique({ where: { isbn } });
    if (existingBook) return existingBook.id;
  }

  // By title + author (no ISBN)
  const existingBook = await tx.books_catalog.findFirst({
    where: {
      title: submission.title,
      author: submission.author
    }
  });

  if (existingBook) return existingBook.id;

  // Create new
  const createdBook = await createCatalogBookFromSubmission({
    submission: { ...submission, isbn },
    catalogOverride,
    tx
  });

  return createdBook.id;
}

/*
==========================================================
UPLOAD IMAGES TO CLOUDINARY
==========================================================
*/

async function uploadImagesToCloudinary(submission) {
  const uploadedImages = [];

  for (const image of submission.book_submission_images) {
    const response = await fetch(image.image_url);
    if (!response.ok) {
      throw new Error("Impossible de télécharger une image de la proposition.");
    }

    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const upload = await uploadToCloudinary(buffer, CLOUDINARY_FOLDERS.BOOK_IMAGES);

    uploadedImages.push({
      image_url: upload.url,
      public_id: upload.public_id,
      uploaded_by: submission.user_id,
      image_source: "user_submission",
      is_cover: image.is_cover,
      sort_order: image.sort_order
    });
  }

  return uploadedImages;
}

/*
==========================================================
CREATE BOOK_IMAGES
==========================================================
*/

async function createBookImages({ uploadedImages, bookCatalogId, tx }) {
  for (const image of uploadedImages) {
    await tx.book_images.create({
      data: {
        book_catalog_id: bookCatalogId,
        image_url: image.image_url,
        public_id: image.public_id,
        uploaded_by: image.uploaded_by,
        image_source: image.image_source,
        is_cover: image.is_cover,
        sort_order: image.sort_order
      }
    });
  }
}

/*
==========================================================
CREATE USER BOOK (EXCHANGE)
==========================================================
*/

async function createUserBook({ submission, bookCatalogId, tx }) {
  // IMPORTANT: destination differs from warehouse sell flow.
  // You requested: insert into `user_books` (not `shop_inventory`).
  // This implementation mirrors the previous mapping style.
  return await tx.user_books.create({
    data: {
      user_id: submission.user_id,
      book_catalog_id: bookCatalogId,
      book_condition: convertConditionForUserBookToSell(submission.book_condition),
      estimated_price: submission.estimated_price ?? submission.price,
      status: "available",
      note: null
    }
  });
}

/*
==========================================================
CLEANUP SUBMISSION
==========================================================
*/

async function deleteSubmissionImages({ submissionId, tx }) {
  await tx.book_submission_images.deleteMany({
    where: { book_submission_id: BigInt(submissionId) }
  });
}

async function deleteSubmission({ submissionId, tx }) {
  await tx.book_submissions.delete({
    where: { id: BigInt(submissionId) }
  });
}

async function cleanupSubmission({ submissionId, tx }) {
  await deleteSubmissionImages({ submissionId, tx });
  await deleteSubmission({ submissionId, tx });
}

/*
==========================================================
APPROVE EXCHANGE SUBMISSION
==========================================================
*/

export async function approveExchangeSubmission(id, catalogOverride = null) {
  const submission = requireSubmission(await getSubmissionWithDetails(id));

  // Upload first (no transaction)
  const uploadedImages = await uploadImagesToCloudinary(submission);

  return await prisma.$transaction(async (tx) => {
    const bookCatalogId = await getOrCreateCatalogBook({
      submission,
      catalogOverride,
      tx
    });

    await createBookImages({
      uploadedImages,
      bookCatalogId,
      tx
    });

    await createUserBook({
      submission,
      bookCatalogId,
      tx
    });

    await cleanupSubmission({
      submissionId: submission.id,
      tx
    });

    return serializeBigInt({
      success: true,
      message: "Proposition d'échange validée avec succès.",
      submission_id: submission.id,
      book_catalog_id: bookCatalogId
    });
  });
}

/*
==========================================================
REJECT EXCHANGE SUBMISSION
==========================================================
*/

export async function rejectExchangeSubmission(id) {
  const submission = requireSubmission(await getSubmissionWithDetails(id));

  try {
    await destroySubmissionImagesCloudinary(submission.book_submission_images);
  } catch (error) {
    console.error("CLOUDINARY_DELETE_ERROR:", error);
  }

  await prisma.$transaction(async (tx) => {
    await cleanupSubmission({
      submissionId: submission.id,
      tx
    });
  });

  return serializeBigInt({
    success: true,
    message: "Proposition d'échange refusée avec succès.",
    submission_id: submission.id
  });
}

