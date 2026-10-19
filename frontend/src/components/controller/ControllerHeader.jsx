import "./ControllerHeader.css";

import { useTranslation } from "react-i18next";

export default function ControllerHeader() {
    const { t } = useTranslation();

    return (
        <header className="controller-header">
            <div className="controller-header-left">
                <img
                    src="/src/images/Logo_kitabiswap.png"
                    alt="KitabiSwap"
                    className="controller-logo"
                />

                <div>
                    <h2>
                        KitabiSwap
                    </h2>

                    <span>
                        {t("controller")}
                    </span>
                </div>
            </div>

            <div className="controller-header-right">
                <button className="controller-notification">
                    🔔
                </button>

                <img
                    className="controller-avatar"
                    src="/images/default-avatar.png"
                    alt="avatar"
                />
            </div>
        </header>
    );
}

