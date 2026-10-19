import "./ProfileSidebar.css";

import { useTranslation } from "react-i18next";

export default function ProfileSidebar({

    user

}) {

    const { t } = useTranslation();

    const avatar =

        user?.avatar_url ||

        "/images/default-avatar.png";

    return (

        <aside className="profile-sidebar">

            {/* =====================================
                AVATAR
            ===================================== */}

            <div className="profile-sidebar-avatar">

                <img

                    src={avatar}

                    alt="Avatar"

                />

            </div>

            {/* =====================================
                USER
            ===================================== */}

            <h2>

                {user?.first_name} {user?.last_name}

            </h2>

            <p>

                {user?.email}

            </p>

            {/* =====================================
                BADGE
            ===================================== */}

            <div className="profile-member">

                <span>

                    🟢 {t("member")}

                </span>

            </div>

            {/* =====================================
                STATISTICS
            ===================================== */}

            <div className="profile-sidebar-card">

                <div className="profile-sidebar-item">

                    <span>

                        {t("wallet_balance")}

                    </span>

                    <strong>

                        {user?.wallet_balance ?? "0.00"} DH

                    </strong>

                </div>

                <div className="profile-sidebar-item">

                    <span>

                        {t("books")}

                    </span>

                    <strong>

                        {user?.books_count ?? 0}

                    </strong>

                </div>

                <div className="profile-sidebar-item">

                    <span>

                        {t("favorites")}

                    </span>

                    <strong>

                        {user?.favorites_count ?? 0}

                    </strong>

                </div>

                <div className="profile-sidebar-item">

                    <span>

                        {t("exchanges")}

                    </span>

                    <strong>

                        {user?.exchange_count ?? 0}

                    </strong>

                </div>

            </div>

            {/* =====================================
                MEMBER SINCE
            ===================================== */}

            <div className="profile-sidebar-footer">

                <span>

                    {t("member_since")}

                </span>

                <strong>

                    {

                        user?.created_at

                            ? new Date(

                                user.created_at

                            ).toLocaleDateString()

                            : "-"

                    }

                </strong>

            </div>

        </aside>

    );

}