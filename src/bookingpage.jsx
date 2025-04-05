
import React, { useState } from "react";
import Footer from "./footer";
import translations from "./translations"; // Import translations
import "./App.css";
import { Link } from "react-router-dom";

const BookingPage = () => {
  const [language, setLanguage] = useState("en"); // State to store the current language

  const toggleLanguage = () => {
    setLanguage((prevLang) => (prevLang === "en" ? "hi" : "en"));
  };

  return (
    <div className="booking-container">
      {/* Navbar */}
      <nav className="navbar">
        <div className="logo">INDIAN RAILWAY</div>
        <ul className="nav-links">
          {translations[language].navbar.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
        <div className="auth-buttons">
          <button>{translations[language].auth[0]}</button>
          <button>{translations[language].auth[1]}</button>
        </div>
        <button className="lang-toggle" onClick={toggleLanguage}>
          {language === "en" ? "हिन्दी" : "English"}
        </button>
      </nav>

      {/* Booking Form */}
      <div className="booking-form">
        <div className="tabs">
          {translations[language].bookingTabs.map((tab, index) => (
            <button key={index}>{tab}</button>
          ))}
        </div>

        <div className="form-fields">
          <input type="text" placeholder={translations[language].form[0]} />
          <input type="text" placeholder={translations[language].form[1]} />
          <input type="date" />
          <input type="number" placeholder={translations[language].form[2]} />
          <div className="checkbox-group">
            {translations[language].checkboxes.map((checkbox, index) => (
              <label key={index}>
                <input type="checkbox" /> {checkbox}
              </label>
            ))}
          </div>
          <Link to="/trainbooking">
           <button className="search-btn">{translations[language].searchBtn}</button>
          </Link>
        </div>
      </div>

      {/* Recent Searches */}
      <div className="recent-searches">
        <h2>{translations[language].recentSearches}</h2>
        <div className="search-items">
          <div className="search-grid">
            {translations[language].recentSearchList.map((search, index) => (
              <div className="search-card" key={index}>
                {search.route} <br /> {search.date}
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Other Services */}
      <div className="other-services">
        <h2>{translations[language].otherServices}</h2>
        <div className="service-items">
          <div className="service-grid">
            {translations[language].serviceData.map((service, index) => (
              <div className="service-card" key={index}>
                <img src={service.image} alt={service.name} />
                <p>{service.name}</p>
              </div>
            ))}
          </div>
        </div>
    </div>

      {/* Footer */}
      <Footer language={language} />
    </div>
  );
};

export default BookingPage;

