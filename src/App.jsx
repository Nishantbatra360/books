import React, { useState, useEffect } from 'react'
import './index.css'
import data from '../links.json'
import coverImg from './assets/Book Cover.jpg'

function App() {
  const { book, amazonLinks } = data;
  const [links, setLinks] = useState(amazonLinks);
  const [localizedCode, setLocalizedCode] = useState(null);

  useEffect(() => {
    // Silently fetch user's country code based on their IP address
    fetch('https://get.geojs.io/v1/ip/country.json')
      .then(res => res.json())
      .then(locationData => {
        if (locationData && locationData.country) {
          const userCountryCode = locationData.country;
          const countryIndex = amazonLinks.findIndex(link => link.code === userCountryCode);

          // If the user's country is in our marketplace list, boost it to the top!
          if (countryIndex !== -1) {
            setLocalizedCode(userCountryCode);
            const updatedLinks = [...amazonLinks];
            const [userLink] = updatedLinks.splice(countryIndex, 1);
            updatedLinks.unshift(userLink);
            setLinks(updatedLinks);
          }
        }
      })
      .catch(err => console.error("Could not detect country:", err));
  }, [amazonLinks]);

  // Helper to determine format dynamically from the ASIN target url
  const getFormat = (url) => {
    return url.includes('B0HL5WLDGN') ? 'Kindle eBook' : 'Paperback + other options';
  };

  const descriptionParagraphs = book.description ? book.description.split('\n\n') : [];

  return (
    <div className="page-wrapper">
      <header className="page-header">
        <div className="header-inner">
          <svg className="header-book-icon" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path>
            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path>
          </svg>
          <h1 className="title">
            {book.title} <span className="title-separator">|</span> <span className="author">by {book.author}</span>
          </h1>
        </div>
      </header>

      <div className="container">
        <img
          src={coverImg}
          alt="Book Cover"
          className="book-cover"
        />
        <div className="content">
          <div className="synopsis-card">
            <div className="synopsis-header">
              <span className="synopsis-badge">Book Synopsis</span>
            </div>
            <div className="synopsis-text">
              {descriptionParagraphs.map((para, idx) => {
                const isLead = idx === 0;
                const isPivot = para.trim() === "Then she sees him truly.";
                const isClosing = idx === descriptionParagraphs.length - 1;

                let extraClass = '';
                if (isLead) extraClass = 'lead-para';
                else if (isPivot) extraClass = 'pivot-para';
                else if (isClosing) extraClass = 'closing-para';

                return (
                  <p key={idx} className={`synopsis-paragraph ${extraClass}`}>
                    {para}
                  </p>
                );
              })}
            </div>
          </div>

          <div className="buy-section">
            <h2>Available on Amazon:</h2>
            <div className="links-grid">
              {links.map((link) => (
                <a
                  key={link.code}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`buy-btn ${link.code === localizedCode ? 'localized-glow' : ''}`}
                >
                  <div className="btn-content">
                    <div className="country-row">
                      <img
                        src={`https://flagcdn.com/w40/${link.code.toLowerCase()}.png`}
                        srcSet={`https://flagcdn.com/w80/${link.code.toLowerCase()}.png 2x`}
                        alt={`${link.country} flag`}
                        className="flag-icon"
                      />
                      <span className="country-name">{link.country}</span>
                    </div>
                    <span className="format-badge">{getFormat(link.url)}</span>
                  </div>
                  {link.code === localizedCode && <span className="local-tag">📍 Your Store</span>}
                </a>
              ))}
            </div>
          </div>

          <div className="social-footer">
            <p>Connect with the author:</p>
            <div className="social-links">
              <a href="https://instagram.com/nishantbatra360" target="_blank" rel="noopener noreferrer">
                Instagram (@nishantbatra360)
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Mobile Bottom CTA */}
      <div className="mobile-sticky-cta">
        <a
          href={links[0].url}
          target="_blank"
          rel="noopener noreferrer"
          className="sticky-cta-btn"
        >
          <img
            src={`https://flagcdn.com/w40/${links[0].code.toLowerCase()}.png`}
            srcSet={`https://flagcdn.com/w80/${links[0].code.toLowerCase()}.png 2x`}
            alt={`${links[0].country} flag`}
            className="sticky-cta-flag"
          />
          <span className="sticky-cta-text">
            Buy on Amazon {links[0].code === localizedCode ? '📍' : ''}
          </span>
        </a>
      </div>
    </div>
  )
}

export default App
