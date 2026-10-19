import CLOUDINARY_FOLDERS from "../constants/cloudinaryFolders.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinaryUpload.js";

function toBuffer(file) {
    // multer typically provides: { buffer, ... }
    // In case buffer is not present, error will surface.
    return file?.buffer;
}

export async function destroySubmissionImagesCloudinary(images) {
    const publicIds = (images || [])
        .map(img => img?.public_id)
        .filter(Boolean);

    const results = [];
    for (const publicId of publicIds) {
        const r = await deleteFromCloudinary(publicId);
        results.push({ publicId, result: r });
    }

    return results;
}

export async function uploadSubmissionImagesCloudinary({
    submissionImages,
    uploadedBy,
    isCoverFallback
}) {
    // submissionImages expected to contain: { image_url, public_id?, is_cover, sort_order, fileBuffer? }
    // We will re-upload from in-memory buffers OR via image_url fetch when buffer is absent.

    // Current codebase’s submission images likely store only image_url/public_id in DB.
    // We therefore require the service layer to pass actual buffers or to fetch them.
    // Here we only upload buffers.

    const uploaded = [];

    let index = 0;
    for (const img of submissionImages || []) {
        index++;
        const buffer = toBuffer(img);
        if (!buffer) {
            throw new Error("Buffer manquant lors de l'upload Cloudinary des images de soumission");
        }

        const is_cover = img?.is_cover ?? (index === 1 ? isCoverFallback ?? true : false);
        const sort_order = img?.sort_order ?? index;

        const { url, public_id } = await uploadToCloudinary(
            buffer,
            CLOUDINARY_FOLDERS.BOOK_IMAGES
        );

        uploaded.push({
            image_url: url,
            public_id,
            is_cover,
            sort_order
        });
    }

    return uploaded;
}

