import React from 'react';
import '../Styles/Footer.css';

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <span className="footer-text">&copy; MyDestiny</span>
        <a href="#" className="footer-link">Política de cookies</a>
        <a href="#" className="footer-link">Termos de uso</a>
      </div>
    </footer>
  );
}

export default Footer;
