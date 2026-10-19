import "./WarehouseHeader.css";

import { useTranslation } from "react-i18next";

export default function WarehouseHeader() {

    const { t } = useTranslation();

    return (

        <header className="warehouse-header">

            <div className="warehouse-header-left">

                <img
                    src="/src/images/Logo_kitabiswap.png"
                    alt="KitabiSwap"
                    className="warehouse-logo"
                />

                <div>

                    <h2>

                        KitabiSwap

                    </h2>

                    <span>

                        {t("warehouse_manager")}

                    </span>

                </div>

            </div>

            <div className="warehouse-header-right">

                <button className="warehouse-notification">

                    🔔

                </button>

                <img

                    className="warehouse-avatar"

                    src="/images/default-avatar.png"

                    alt="avatar"

                />

            </div>

        </header>

    );

}