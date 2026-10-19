import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./AboutUs.css";

export default function AboutUs() {
  const { t } = useTranslation();

  return (
    <>
      <Header />

      {/* ========== HERO ========== */}
      <section className="aboutus-hero">
        <div className="aboutus-hero-container">
          <span className="aboutus-hero-tag">{t("aboutus_tag")}</span>
          <h1>{t("aboutus_title")}</h1>
          <p>{t("aboutus_description")}</p>
        </div>
      </section>

      {/* ========== MISSION ========== */}
      <section className="aboutus-section">
        <div className="aboutus-container">
          <div className="aboutus-title">
            <h2>🎯 {t("aboutus_mission_title")}</h2>
            <p>{t("aboutus_mission_subtitle")}</p>
          </div>
          <div className="aboutus-content">
            <p>{t("aboutus_mission_text_1")}</p>
            <p>{t("aboutus_mission_text_2")}</p>
            <p>{t("aboutus_mission_text_3")}</p>
          </div>
        </div>
      </section>

      {/* ========== VISION ========== */}
      <section className="aboutus-section">
        <div className="aboutus-container">
          <div className="aboutus-title">
            <h2>👁️ {t("aboutus_vision_title")}</h2>
            <p>{t("aboutus_vision_subtitle")}</p>
          </div>
          <div className="aboutus-content">
            <p>{t("aboutus_vision_text")}</p>
          </div>
        </div>
      </section>

      {/* ========== VALUES ========== */}
      <section className="aboutus-section">
        <div className="aboutus-container">
          <div className="aboutus-title">
            <h2>💎 {t("aboutus_values_title")}</h2>
            <p>{t("aboutus_values_subtitle")}</p>
          </div>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">📖</div>
              <h3>{t("aboutus_value_1_title")}</h3>
              <p>{t("aboutus_value_1_desc")}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">♻️</div>
              <h3>{t("aboutus_value_2_title")}</h3>
              <p>{t("aboutus_value_2_desc")}</p>
            </div>
            <div className="value-card">
              <div className="value-icon">🌍</div>
              <h3>{t("aboutus_value_3_title")}</h3>
              <p>{t("aboutus_value_3_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== HOW IT WORKS ========== */}
      <section className="aboutus-section">
        <div className="aboutus-container">
          <div className="aboutus-title">
            <h2>⚙️ {t("aboutus_how_title")}</h2>
            <p>{t("aboutus_how_subtitle")}</p>
          </div>
          <div className="aboutus-content">
            <p>{t("aboutus_how_text")}</p>
          </div>
        </div>
      </section>

      {/* ========== BENEFITS ========== */}
      <section className="aboutus-section">
        <div className="aboutus-container">
          <div className="aboutus-title">
            <h2>✨ {t("aboutus_benefits_title")}</h2>
            <p>{t("aboutus_benefits_subtitle")}</p>
          </div>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">💰</div>
              <h3>{t("aboutus_benefit_1_title")}</h3>
              <p>{t("aboutus_benefit_1_desc")}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🎓</div>
              <h3>{t("aboutus_benefit_2_title")}</h3>
              <p>{t("aboutus_benefit_2_desc")}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🇲🇦</div>
              <h3>{t("aboutus_benefit_3_title")}</h3>
              <p>{t("aboutus_benefit_3_desc")}</p>
            </div>
            <div className="benefit-card">
              <div className="benefit-icon">🤝</div>
              <h3>{t("aboutus_benefit_4_title")}</h3>
              <p>{t("aboutus_benefit_4_desc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ========== CTA ========== */}
      <section className="aboutus-section">
        <div className="aboutus-container">
          <div className="aboutus-cta">
            <Link to="/register" className="aboutus-cta-btn">
              {t("aboutus_cta")}
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}

