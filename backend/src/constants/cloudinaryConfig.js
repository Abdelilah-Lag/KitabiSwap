export const CLOUDINARY_CONFIG = {
    ROOT_FOLDER: "kitabiswap",

    // ===========================
    // Taille maximale
    // ===========================
    MAX_IMAGE_SIZE: 15 * 1024 * 1024, // 15 MB

    MAX_DOCUMENT_SIZE: 25 * 1024 * 1024, // 25 MB

    // ===========================
    // Images autorisées
    // ===========================
    ALLOWED_IMAGE_TYPES: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/heic",
        "image/heif",
        "image/avif",
        "image/bmp",
        "image/tiff"
    ],

    // ===========================
    // Documents autorisés
    // ===========================
    ALLOWED_DOCUMENT_TYPES: [
        "application/pdf"
    ],

    // ===========================
    // Nombre maximum de fichiers
    // ===========================
    MAX_BOOK_IMAGES: 10,

    MAX_BOOK_SUBMISSION_IMAGES: 10,

    MAX_CHAT_IMAGES: 10,

    MAX_PAYMENT_PROOF_IMAGES: 2,

    MAX_PAYMENT_METHOD_IMAGES: 5,

    MAX_AVATAR_IMAGES: 1
};