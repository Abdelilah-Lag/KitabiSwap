import { useState, useEffect } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { getSettings, saveSetting, getDefaultSettings } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminSettings() {
    const { t } = useTranslation();
    const [settings, setSettings] = useState({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => { load(); }, []);

    async function load() {
        try {
            const res = await getSettings();
            const defaultsRes = await getDefaultSettings();
            setSettings({ ...defaultsRes.defaults, ...res.settings });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    async function handleSave(key, value) {
        setSaving(true);
        try {
            await saveSetting(key, value);
            setSettings(prev => ({ ...prev, [key]: value }));
        } catch (err) {
            console.error(err);
        } finally {
            setSaving(false);
        }
    }

    const fields = [
        { key: "exchange_commission_rate", label: t("exchange_commission_rate"), type: "number", suffix: "%" },
        { key: "withdrawal_fee", label: t("withdrawal_fee"), type: "number", suffix: "DH" },
        { key: "delivery_price_per_km", label: t("delivery_price_per_km"), type: "number", suffix: "DH/km" },
        { key: "max_exchange_books", label: t("max_exchange_books"), type: "number" },
        { key: "exchange_expiration_days", label: t("exchange_expiration_days"), type: "number", suffix: t("days") },
        { key: "platform_name", label: t("platform_name"), type: "text" },
        { key: "platform_email", label: t("platform_email"), type: "email" },
        { key: "platform_phone", label: t("platform_phone"), type: "text" },
        { key: "platform_address", label: t("platform_address"), type: "text" }
    ];

    if (loading) return <AdminLayout><div className="admin-loading">{t("loading")}</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("platform_settings")}</h1>

                <div className="admin-settings-grid">
                    {fields.map(field => (
                        <div key={field.key} className="admin-setting-card">
                            <label>{field.label}</label>
                            <div className="admin-setting-input-group">
                                <input
                                    type={field.type}
                                    value={settings[field.key] || ""}
                                    onChange={e => setSettings(prev => ({ ...prev, [field.key]: e.target.value }))}
                                />
                                {field.suffix && <span className="admin-setting-suffix">{field.suffix}</span>}
                            </div>
                            <button
                                className="admin-btn-sm"
                                onClick={() => handleSave(field.key, settings[field.key])}
                                disabled={saving}
                            >
                                {t("save")}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </AdminLayout>
    );
}

