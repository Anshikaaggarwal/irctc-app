import React from "react";
import translations from "./translations";
import "./styles.css";

const Footer = ({ language }) => {
  const langData = translations[language] || translations["en"]; // Fallback to English if language is undefined

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* About Us Section */}
        <div className="footer-section">
          <h3>{langData.aboutUsTitle}</h3>
          <p>{langData.aboutUsText}</p>
        </div>

        {/* Quick Links Section */}
        <div className="footer-section">
          <h3>{langData.quickLinksTitle}</h3>
          <ul>
            {(langData.quickLinks || []).map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>

        {/* Follow Us Section */}
        <div className="footer-section">
          <h3>{langData.followUsTitle}</h3>
          <div className="social-icons">
            {(langData.socialLinks || [])
              .map((platform, index) => <span key={index}>{platform}</span>)
              .reduce((prev, curr) => [prev, " | ", curr], [])}
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <p>{langData.footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
