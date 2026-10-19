import { useTranslation } from "react-i18next";

export default function AdminFooter() {
    const { t } = useTranslation();
    const year = new Date().getFullYear();

    return (
        <footer className="admin-footer">
            <p>&copy; {year} KitabiSwap. {t("all_rights_reserved")}</p>
        </footer>
    );
}

