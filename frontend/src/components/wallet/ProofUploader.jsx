import "./ProofUploader.css";

import { useRef } from "react";
import { useTranslation } from "react-i18next";

export default function ProofUploader({

    image,
    setImage

}) {

    const { t } = useTranslation();

    const inputRef = useRef();

    function handleChange(e) {

        const file = e.target.files[0];

        if (!file) return;

        setImage(file);

    }

    return (

        <div className="proof-uploader">

            <div className="proof-header">

                <h2>

                    {t("payment_proof")}

                </h2>

                <p>

                    {t("upload_the_screenshot_or_photo_of_your_transfer_receipt")}

                </p>

            </div>

            <input

                ref={inputRef}

                hidden

                type="file"

                accept="image/*"

                onChange={handleChange}

            />

            {

                !image &&

                <div

                    className="proof-dropzone"

                    onClick={() => inputRef.current.click()}

                >

                    <div className="proof-icon">

                        📷

                    </div>

                    <h3>

                        {t("click_to_upload")}

                    </h3>

                    <p>

                        JPG • PNG • WEBP

                    </p>

                </div>

            }

            {

                image &&

                <div className="proof-preview-card">

                    <img

                        src={URL.createObjectURL(image)}

                        alt="proof"

                    />

                    <div className="proof-preview-content">

                        <h3>

                            {image.name}

                        </h3>

                        <span>

                            {(image.size / 1024 / 1024).toFixed(2)} MB

                        </span>

                    </div>

                    <button

                        type="button"

                        className="proof-change-btn"

                        onClick={() => inputRef.current.click()}

                    >

                        {t("change_image")}

                    </button>

                </div>

            }

        </div>

    );

}