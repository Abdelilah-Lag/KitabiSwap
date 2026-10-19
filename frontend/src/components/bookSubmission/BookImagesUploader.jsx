import "./BookImagesUploader.css";

import { useRef } from "react";
import { useTranslation } from "react-i18next";

import {

    FaCloudUploadAlt,
    FaImages,
    FaTrashAlt

} from "react-icons/fa";

export default function BookImagesUploader({

    images,
    setImages

}) {

    const { t } = useTranslation();

    const inputRef = useRef(null);

    /* ==========================================
       OPEN FILE PICKER
    ========================================== */

    function openFilePicker() {

        inputRef.current.click();

    }

    /* ==========================================
       SELECT IMAGES
    ========================================== */

    function handleImages(event) {

        const files = Array.from(event.target.files);

        if (files.length === 0) {

            return;

        }

        const selectedImages = files.map((file) => ({

            file,

            preview: URL.createObjectURL(file)

        }));

        setImages((previous) => [

            ...previous,

            ...selectedImages

        ]);

    }

    /* ==========================================
       REMOVE IMAGE
    ========================================== */

    function removeImage(index) {

        setImages((previous) =>

            previous.filter((_, i) => i !== index)

        );

    }

    return (

        <section className="submission-section">

            {/* ======================================
                HEADER
            ====================================== */}

            <div className="section-header">

                <h2>

                    {t("book_images")}

                </h2>

                <p>

                    {t("upload_book_images")}

                </p>

            </div>

            {/* ======================================
                HIDDEN INPUT
            ====================================== */}

            <input

                ref={inputRef}

                type="file"

                multiple

                accept="image/*"

                onChange={handleImages}

                hidden

            />

            {/* ======================================
                UPLOAD AREA
            ====================================== */}

            <div

                className="upload-area"

                onClick={openFilePicker}

            >

                <FaCloudUploadAlt className="upload-icon" />

                <h3>

                    {t("click_to_upload_images")}

                </h3>

                <p>

                    PNG • JPG • WEBP

                </p>

            </div>
                        {/* ======================================
                IMAGES HEADER
            ====================================== */}

            {

                images.length > 0 && (

                    <div className="images-header">

                        <div className="images-count">

                            <FaImages />

                            <span>

                                {images.length}

                                {" "}

                                {

                                    images.length > 1

                                        ? t("images")

                                        : t("image")

                                }

                            </span>

                        </div>

                        <small>

                            {t("select_cover_image_after")}

                        </small>

                    </div>

                )

            }

            {/* ======================================
                IMAGES GRID
            ====================================== */}

            {

                images.length > 0 && (

                    <div className="images-grid">

                        {

                            images.map((image, index) => (

                                <div

                                    key={index}

                                    className="image-card"

                                >

                                    {/* IMAGE */}

                                    <img

                                        src={image.preview}

                                        alt={`book-${index}`}

                                    />

                                    {/* IMAGE NUMBER */}

                                    <span className="image-index">

                                        #

                                        {index + 1}

                                    </span>

                                    {/* DELETE */}

                                    <button

                                        type="button"

                                        className="delete-image"

                                        onClick={() => removeImage(index)}

                                    >

                                        <FaTrashAlt />

                                    </button>

                                </div>

                            ))

                        }

                    </div>

                )

            }
                        {/* ======================================
                EMPTY STATE
            ====================================== */}

            {

                images.length === 0 && (

                    <div className="images-empty">

                        <FaImages />

                        <h4>

                            {t("no_images_selected")}

                        </h4>

                        <p>

                            {t("please_upload_book_images")}

                        </p>

                    </div>

                )

            }

            {/* ======================================
                HELP
            ====================================== */}

            <div className="upload-help">

                <ul>

                    <li>

                        ✓ {t("minimum_one_image")}

                    </li>

                    <li>

                        ✓ {t("maximum_ten_images")}

                    </li>

                    <li>

                        ✓ JPG • PNG • WEBP

                    </li>

                    <li>

                        ✓ {t("high_quality_images")}

                    </li>

                    <li>

                        ✓ {t("cover_image_selected_next_step")}

                    </li>

                </ul>

            </div>

        </section>

    );

}