import React from 'react';
import './Footer.css';
import { FaChevronUp } from 'react-icons/fa';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} MangaDex App. Todos os direitos reservados.</p>
      </div>
      <button className="scroll-to-top" onClick={scrollToTop}>
        <FaChevronUp />
      </button>
    </footer>
  );
};

export default Footer;
