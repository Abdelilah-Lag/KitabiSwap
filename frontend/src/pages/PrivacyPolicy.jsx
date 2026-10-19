import { useTranslation } from "react-i18next";
import Header from "../header/Header";
import Footer from "../footer/Footer";
import "./PrivacyPolicy.css";

export default function PrivacyPolicy() {
  const { t } = useTranslation();

  return (
    <>
      <Header />

      {/* HERO */}
      <section className="privacy-hero">
        <div className="privacy-hero-container">
          <span className="privacy-hero-tag">{t("privacy_tag")}</span>
          <h1>{t("privacy_title")}</h1>
          <p>{t("privacy_description")}</p>
        </div>
      </section>

      {/* CONTENT */}
      <section className="privacy-main">
        <div className="privacy-container">

          <div className="privacy-update">
            <strong>{t("privacy_last_updated")}:</strong>{" "}
            {t("privacy_update_date")}
          </div>

          {/* ================================================= */}
          {/* 1. Information We Collect */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section1_title")}</h2>

            <p>{t("privacy_section1_desc")}</p>

            <h3>{t("privacy_account_title")}</h3>
            <ul>
              <li>{t("privacy_account_item1")}</li>
              <li>{t("privacy_account_item2")}</li>
              <li>{t("privacy_account_item3")}</li>
              <li>{t("privacy_account_item4")}</li>
              <li>{t("privacy_account_item5")}</li>
            </ul>

            <h3>{t("privacy_address_title")}</h3>
            <ul>
              <li>{t("privacy_address_item1")}</li>
              <li>{t("privacy_address_item2")}</li>
              <li>{t("privacy_address_item3")}</li>
              <li>{t("privacy_address_item4")}</li>
            </ul>

            <h3>{t("privacy_activity_title")}</h3>
            <ul>
              <li>{t("privacy_activity_item1")}</li>
              <li>{t("privacy_activity_item2")}</li>
              <li>{t("privacy_activity_item3")}</li>
              <li>{t("privacy_activity_item4")}</li>
              <li>{t("privacy_activity_item5")}</li>
            </ul>

            <h3>{t("privacy_financial_title")}</h3>
            <ul>
              <li>{t("privacy_financial_item1")}</li>
              <li>{t("privacy_financial_item2")}</li>
              <li>{t("privacy_financial_item3")}</li>
              <li>{t("privacy_financial_item4")}</li>
              <li>{t("privacy_financial_item5")}</li>
            </ul>

            <h3>{t("privacy_technical_title")}</h3>
            <ul>
              <li>{t("privacy_technical_item1")}</li>
              <li>{t("privacy_technical_item2")}</li>
              <li>{t("privacy_technical_item3")}</li>
              <li>{t("privacy_technical_item4")}</li>
            </ul>
          </div>

          {/* ================================================= */}
          {/* 2. How We Use Your Information */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section2_title")}</h2>

            <p>{t("privacy_section2_desc")}</p>

            <ul>
              <li>{t("privacy_usage_item1")}</li>
              <li>{t("privacy_usage_item2")}</li>
              <li>{t("privacy_usage_item3")}</li>
              <li>{t("privacy_usage_item4")}</li>
              <li>{t("privacy_usage_item5")}</li>
              <li>{t("privacy_usage_item6")}</li>
              <li>{t("privacy_usage_item7")}</li>
              <li>{t("privacy_usage_item8")}</li>
              <li>{t("privacy_usage_item9")}</li>
              <li>{t("privacy_usage_item10")}</li>
            </ul>
          </div>

          {/* ================================================= */}
          {/* 3. Information Sharing */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section3_title")}</h2>

            <p>{t("privacy_section3_desc")}</p>

            <div className="privacy-highlight">
              <strong>{t("privacy_section3_highlight")}</strong>
            </div>

            <p>{t("privacy_section3_desc2")}</p>

            <ul>
              <li>{t("privacy_sharing_item1")}</li>
              <li>{t("privacy_sharing_item2")}</li>
              <li>{t("privacy_sharing_item3")}</li>
              <li>{t("privacy_sharing_item4")}</li>
            </ul>
          </div>

          {/* ================================================= */}
          {/* 4. Data Security */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section4_title")}</h2>

            <p>{t("privacy_section4_desc")}</p>

            <ul>
              <li>{t("privacy_security_item1")}</li>
              <li>{t("privacy_security_item2")}</li>
              <li>{t("privacy_security_item3")}</li>
              <li>{t("privacy_security_item4")}</li>
            </ul>

            <p>{t("privacy_section4_desc2")}</p>
          </div>

          {/* ================================================= */}
          {/* 5. Data Retention */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section5_title")}</h2>

            <p>{t("privacy_section5_desc")}</p>

            <ul>
              <li>{t("privacy_retention_item1")}</li>
              <li>{t("privacy_retention_item2")}</li>
              <li>{t("privacy_retention_item3")}</li>
              <li>{t("privacy_retention_item4")}</li>
            </ul>

            <p>{t("privacy_section5_desc2")}</p>
          </div>
                    {/* ================================================= */}
          {/* 6. Cookies and Analytics */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section6_title")}</h2>

            <p>{t("privacy_section6_desc")}</p>

            <ul>
              <li>{t("privacy_cookies_item1")}</li>
              <li>{t("privacy_cookies_item2")}</li>
              <li>{t("privacy_cookies_item3")}</li>
              <li>{t("privacy_cookies_item4")}</li>
            </ul>

            <p>{t("privacy_section6_desc2")}</p>
          </div>

          {/* ================================================= */}
          {/* 7. Your Rights */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section7_title")}</h2>

            <p>{t("privacy_section7_desc")}</p>

            <ul>
              <li>{t("privacy_rights_item1")}</li>
              <li>{t("privacy_rights_item2")}</li>
              <li>{t("privacy_rights_item3")}</li>
              <li>{t("privacy_rights_item4")}</li>
              <li>{t("privacy_rights_item5")}</li>
            </ul>

            <p>{t("privacy_section7_desc2")}</p>
          </div>

          {/* ================================================= */}
          {/* 8. Children's Privacy */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section8_title")}</h2>

            <p>{t("privacy_section8_desc")}</p>
          </div>

          {/* ================================================= */}
          {/* 9. Changes to this Privacy Policy */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section9_title")}</h2>

            <p>{t("privacy_section9_desc")}</p>
          </div>

          {/* ================================================= */}
          {/* 10. Contact Us */}
          {/* ================================================= */}

          <div className="privacy-section">
            <h2>{t("privacy_section10_title")}</h2>

            <p>{t("privacy_section10_desc")}</p>

            <div className="privacy-highlight">
              <p>
                <strong>{t("privacy_email_label")}:</strong>{" "}
                <a href="mailto:kitabiswap@gmail.com">
                  kitabiswap@gmail.com
                </a>
              </p>
            </div>

            <p>{t("privacy_footer_message")}</p>
          </div>

        </div>
      </section>

      <Footer />
    </>
  );
}