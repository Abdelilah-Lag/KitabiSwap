import { useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import { sendAdminMessage, getSentMessages } from "../../services/adminDashboardService";
import { useTranslation } from "react-i18next";

export default function AdminMessages() {
    const { t } = useTranslation();
    const [title, setTitle] = useState("");
    const [message, setMessage] = useState("");
    const [messageType, setMessageType] = useState("information");
    const [targetType, setTargetType] = useState("all");
    const [targetUserId, setTargetUserId] = useState("");
    const [sending, setSending] = useState(false);
    const [sent, setSent] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    async function handleSend(e) {
        e.preventDefault();
        if (!title.trim() || !message.trim()) return alert(t("fill_all_fields"));
        setSending(true);
        try {
            await sendAdminMessage({
                title: title.trim(),
                message: message.trim(),
                message_type: messageType,
                target_type: targetType,
                target_user_id: targetType === "specific_user" ? targetUserId : undefined
            });
            alert(t("message_sent_success"));
            setTitle("");
            setMessage("");
        } catch (err) {
            console.error(err);
            alert(t("error_sending_message"));
        } finally {
            setSending(false);
        }
    }

    async function loadHistory() {
        try {
            const res = await getSentMessages({ page: 1, limit: 20 });
            setSent(res.messages || []);
            setShowHistory(true);
        } catch (err) {
            console.error(err);
        }
    }

    const typeLabels = {
        information: "ℹ️ " + t("information"),
        maintenance: "🔧 " + t("maintenance"),
        promotion: "🎉 " + t("promotion"),
        urgent: "⚠️ " + t("urgent")
    };

    const targetLabels = {
        all: t("all_users"),
        all_users: t("all_users_role"),
        all_delivery: t("all_delivery"),
        all_controller: t("all_controller"),
        all_warehouse: t("all_warehouse"),
        all_payment_manager: t("all_payment_managers"),
        specific_user: t("specific_user")
    };

    return (
        <AdminLayout>
            <div className="admin-page">
                <h1 className="admin-page-title">{t("message_center")}</h1>

                <div className="admin-message-form">
                    <form onSubmit={handleSend}>
                        <div className="admin-form-group">
                            <label>{t("title")}</label>
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} required />
                        </div>

                        <div className="admin-form-group">
                            <label>{t("message")}</label>
                            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={5} required />
                        </div>

                        <div className="admin-form-row">
                            <div className="admin-form-group">
                                <label>{t("message_type")}</label>
                                <select value={messageType} onChange={e => setMessageType(e.target.value)}>
                                    {Object.entries(typeLabels).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="admin-form-group">
                                <label>{t("recipients")}</label>
                                <select value={targetType} onChange={e => setTargetType(e.target.value)}>
                                    {Object.entries(targetLabels).map(([key, label]) => (
                                        <option key={key} value={key}>{label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {targetType === "specific_user" && (
                            <div className="admin-form-group">
                                <label>{t("user_id")}</label>
                                <input type="number" value={targetUserId} onChange={e => setTargetUserId(e.target.value)} placeholder={t("enter_user_id")} />
                            </div>
                        )}

                        <button type="submit" className="admin-btn" disabled={sending}>
                            {sending ? t("sending") : t("send_message")}
                        </button>
                    </form>
                </div>

                <div className="admin-section">
                    <button onClick={loadHistory} className="admin-btn secondary">
                        {t("view_sent_messages")}
                    </button>
                    {showHistory && (
                        <div className="admin-table-container" style={{ marginTop: 16 }}>
                            {sent.length === 0 ? (
                                <p>{t("no_sent_messages")}</p>
                            ) : (
                                <table className="admin-table">
                                    <thead>
                                        <tr>
                                            <th>{t("title")}</th>
                                            <th>{t("type")}</th>
                                            <th>{t("target")}</th>
                                            <th>{t("sent_at")}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {sent.map(msg => (
                                            <tr key={msg.id}>
                                                <td>{msg.title}</td>
                                                <td>{typeLabels[msg.message_type] || msg.message_type}</td>
                                                <td>{targetLabels[msg.target_type] || msg.target_type}</td>
                                                <td>{new Date(msg.created_at).toLocaleString("fr-FR")}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
}

