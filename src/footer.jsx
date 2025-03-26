import React from "react";
import translations from "./translations";
import "./styles.css";

const Footer = ({ language }) => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>{translations[language].aboutUsTitle}</h3>
          <p>{translations[language].aboutUsText}</p>
        </div>
        <div className="footer-section">
          <h3>{translations[language].quickLinksTitle}</h3>
          <ul>
            {translations[language].quickLinks.map((link, index) => (
              <li key={index}>{link}</li>
            ))}
          </ul>
        </div>
        <div className="footer-section">
          <h3>{translations[language].followUsTitle}</h3>
          <div className="social-icons">
            {translations[language].socialLinks.map((platform, index) => (
              <span key={index}>{platform}</span>
            )).reduce((prev, curr) => [prev, " | ", curr])}
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>{translations[language].footerText}</p>
      </div>
    </footer>
  );
};

export default Footer;
