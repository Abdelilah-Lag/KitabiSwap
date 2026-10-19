import "./UserFooter.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function UserFooter() {

    const { t } = useTranslation();

    return (

        <footer className="user-footer">

            <div className="user-footer-container">

                <div className="footer-left">

                    <h2>

                        <span className="logo-green">

                            Kitabi

                        </span>

                        <span className="logo-dark">

                            Swap

                        </span>

                    </h2>

                    <p>

                        {t("footer_description")}

                    </p>

                </div>

                <div className="footer-links">

                    <Link to="/user">

                        {t("dashboard")}

                    </Link>

                    <Link to="/user/exchange">

                        {t("exchange")}

                    </Link>

                    <Link to="/user/magazine">

                        {t("magazine")}

                    </Link>

                    <Link to="/user/my-books">

                        {t("my_books")}

                    </Link>

                    <Link to="/user/wallet">

                        {t("wallet")}

                    </Link>

                    <Link to="/user/profile">

                        {t("profile")}

                    </Link>

                </div>

            </div>

            <div className="footer-bottom">

                © {new Date().getFullYear()} KitabiSwap — {t("all_rights_reserved")}

            </div>

        </footer>

    );

}