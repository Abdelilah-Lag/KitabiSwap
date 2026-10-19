import "./UserHeader.css";
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";

export default function UserHeader({ user }) {

    const { t, i18n } = useTranslation();

    const navigate = useNavigate();

    const [currentUser, setCurrentUser] = useState(() => {

        if (user) {

            return user;

        }

        try {

            const storedUser = localStorage.getItem("user");

            return storedUser ? JSON.parse(storedUser) : null;

        }

        catch (error) {

            console.error("Failed to parse stored user", error);

            return null;

        }

    });

    useEffect(() => {

        if (user) {

            setCurrentUser(user);

            return;

        }

        try {

            const storedUser = localStorage.getItem("user");

            if (storedUser) {

                setCurrentUser(JSON.parse(storedUser));

            }

        }

        catch (error) {

            console.error("Failed to parse stored user", error);

        }

    }, [user]);

    const avatarUrl =
        currentUser?.avatar_url ||
        currentUser?.avatar ||
        currentUser?.profile?.avatar_url ||
        currentUser?.profile?.avatar ||
        currentUser?.user?.avatar_url ||
        currentUser?.user?.avatar ||
        currentUser?.image ||
        currentUser?.photo ||
        "/images/default-avatar.png";

    const displayName = currentUser

        ? `${currentUser.first_name || currentUser.firstName || currentUser.name || ""} ${currentUser.last_name || currentUser.lastName || ""}`.trim() || currentUser.name || currentUser.email || "User"

        : "User";

    function logout() {

        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/");

    }

    function changeLanguage(lang) {

        i18n.changeLanguage(lang);

        localStorage.setItem("i18nextLng", lang);

    }

    return (

        <header className="user-header">

            <div className="user-header-container">

                {/* ================= Logo ================= */}

                <NavLink
                    to="/user"
                    className="user-logo"
                >

                    <img
                        src="/src/images/Logo_kitabiswap.png"
                        alt="KitabiSwap logo"
                        className="user-logo-image"
                    />

                </NavLink>

                {/* ================= Menu ================= */}

                <nav className="user-nav">

                    <NavLink
                        to="/user"
                        end
                    >
                        {t("dashboard")}
                    </NavLink>

                    <NavLink
                        to="/user/exchange"
                    >
                        {t("exchange")}
                    </NavLink>

                    <NavLink
                        to="/user/magazine"
                    >
                        {t("magazine")}
                    </NavLink>

                    <NavLink
                        to="/user/book-submission/add"
                    >
                        {t("add_book")}
                    </NavLink>

                    <NavLink
                        to="/user/my-books"
                    >
                        {t("my_books")}
                    </NavLink>

                    <NavLink
                        to="/user/wallet"
                    >
                        {t("wallet")}
                    </NavLink>

                    <NavLink
                        to="/user/favorites"
                    >
                        {t("favorites")}
                    </NavLink>

                </nav>

                {/* ================= User ================= */}

                <div className="user-profile">

                    <NavLink
                        to="/user/profile"
                        className="user-avatar"
                    >

                        <img

                            src={avatarUrl}

                            alt="avatar"

                        />

                    </NavLink>

                    <div className="user-information">

                        <span className="user-name">

                            {displayName}

                        </span>

                        <span className="user-role">

                            {t("user")}

                        </span>

                    </div>

                    <div className="language-switcher">

                        <button

                            className={i18n.language.startsWith("fr") ? "active" : ""}

                            onClick={() => changeLanguage("fr")}

                        >

                            FR

                        </button>

                        <button

                            className={i18n.language.startsWith("en") ? "active" : ""}

                            onClick={() => changeLanguage("en")}

                        >

                            EN

                        </button>

                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >

                        {t("logout")}

                    </button>

                </div>

            </div>

        </header>

    );

}