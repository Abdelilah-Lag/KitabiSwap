import { useState } from "react";
import { useTranslation } from "react-i18next";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import { submitContactMessage } from "../services/contactService";
import "./Contact.css";

export default function Contact() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError("");

    try {
      await submitContactMessage({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message,
      });

      setSubmitted(true);
    } catch (err) {
      const msg =
        err?.response?.data?.message ||
        "Erreur lors de l'envoi du message.";
      setError(msg);
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Header />

      <section className="contact-hero">
        <div className="contact-hero-container">
          <span className="contact-hero-tag">{t("contact_tag")}</span>
          <h1>{t("contact_page_title")}</h1>
          <p>{t("contact_page_desc")}</p>
        </div>
      </section>

      <section className="contact-main">
        <div className="contact-grid">

          <div className="contact-info-cards">

            <div className="contact-info-card">
              <div className="contact-icon"></div>
              <div>
                <h3>{t("contact_email_title")}</h3>
                <p>kitabiswap@gmail.com</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"></div>
              <div>
                <h3>{t("contact_phone_title")}</h3>
                <p>{t("contact_phone_value")}</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"></div>
              <div>
                <h3>{t("contact_address_title")}</h3>
                <p>Temara - Maroc</p>
              </div>
            </div>

            <div className="contact-info-card">
              <div className="contact-icon"></div>
              <div>
                <h3>{t("contact_hours_title")}</h3>
                <p>{t("contact_hours_value")}</p>
              </div>
            </div>

          </div>

          <div className="contact-form-wrapper">
            {!submitted ? (
              <>
                <h2>{t("contact_form_title")}</h2>
                <p>{t("contact_form_desc")}</p>

                {error && (
                  <div className="contact-error">{error}</div>
                )}

                <form
                  className="contact-form"
                  onSubmit={handleSubmit}
                >
                  <div className="form-row">

                    <div className="form-group">
                      <label htmlFor="name">
                        {t("contact_name")}
                      </label>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="email">
                        {t("contact_email")}
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>

                  </div>

                  <div className="form-group">
                    <label htmlFor="subject">
                      {t("contact_subject")}
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      required
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="message">
                      {t("contact_message")}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <button
                    type="submit"
                    className="submit-btn"
                    disabled={sending}
                  >
                    {sending ? t("sending") : t("contact_send")}
                  </button>
                </form>
              </>
            ) : (
              <div className="contact-success">
                <div className="success-icon">✅</div>
                <h3>{t("contact_success_title")}</h3>
                <p>{t("contact_success_desc")}</p>
              </div>
            )}
          </div>

        </div>
      </section>

      <section className="contact-map-section">
        <div className="contact-map-container">
          <h2>{t("contact_map_title")}</h2>

          <div className="contact-map-embed">
            <iframe
              title="Localisation KitabiSwap - Temara"
              src="https://www.openstreetmap.org/export/embed.html?bbox=-6.949142,33.872355,-6.909142,33.912355&layer=mapnik&marker=33.892355,-6.929142"
              width="100%"
              height="400"
              style={{
                border: "none",
                borderRadius: "20px",
              }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />

            <div className="contact-map-link">
              <a
                href="https://www.openstreetmap.org/?mlat=33.892355&mlon=-6.929142#map=15/33.892355/-6.929142&layers=N"
                target="_blank"
                rel="noopener noreferrer"
              >
                Voir sur OpenStreetMap
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}