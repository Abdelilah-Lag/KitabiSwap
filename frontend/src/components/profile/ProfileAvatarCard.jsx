import "./ProfileAvatarCard.css";

import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

export default function ProfileAvatarCard({ user, onUpload }) {

    const { t } = useTranslation();

    const inputRef = useRef(null);

    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    // ✅ Dès que l'URL réelle change (nouveau upload sauvegardé en BDD),
    //    on jette le preview blob local pour afficher l'URL Cloudinary.
    useEffect(() => {
        if (preview) {
            setPreview(null);
            // libère la mémoire du blob
            // (URL.revokeObjectURL peut être appelé; on skip par simplicité)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.avatar_url]);

    // ✅ Cache-busting : force le navigateur à recharger l'image
    //    même si l'URL Cloudinary est identique par hasard.
    const remoteAvatar = user?.avatar_url
        ? `${user.avatar_url}${user.avatar_url.includes("?") ? "&" : "?"}v=${encodeURIComponent(user?.updated_at ?? Date.now())}`
        : "/images/default-avatar.png";

    const avatar = preview || remoteAvatar;

    function handleChooseImage() {
        inputRef.current?.click();
    }

    async function handleImage(event) {
        const file = event.target.files?.[0];
        if (!file) return;

        setPreview(URL.createObjectURL(file));

        try {
            setLoading(true);
            await onUpload(file);
        } catch (error) {
            console.error(error);
            setPreview(null);
        } finally {
            setLoading(false);
            // reset l'input pour pouvoir re-sélectionner le même fichier
            if (inputRef.current) inputRef.current.value = "";
        }
    }

    return (
        <div className="profile-card">

            <div className="profile-card-header">
                <h2>{t("profile_picture")}</h2>
                <p>{t("profile_picture_description")}</p>
            </div>

            <div className="profile-avatar-card">

                <div className="profile-avatar-image">
                    <img
                        key={avatar}
                        src={avatar}
                        alt="Avatar"
                    />
                </div>

                <div className="profile-avatar-content">

                    <h3>{user?.first_name} {user?.last_name}</h3>
                    <p>{user?.email}</p>

                    <input
                        ref={inputRef}
                        hidden
                        type="file"
                        accept="image/*"
                        onChange={handleImage}
                    />

                    <button
                        className="profile-avatar-btn"
                        type="button"
                        disabled={loading}
                        onClick={handleChooseImage}
                    >
                        {loading ? t("uploading") : t("change_profile_picture")}
                    </button>

                </div>

            </div>

        </div>
    );
}
