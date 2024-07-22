import React, { useRef, useState, useEffect } from 'react';
import './Navbar.css';

function Navbar() {

    /* Humburger Menu Functionality */
    const [isOpen, setIsOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = () => {
    setIsOpen(!isOpen);
    };

    const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
          setIsOpen(false);
        }
      };
    
      const handleLinkClick = () => {
        setIsOpen(false);
      };
    
      useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
      }, []);

  /* Dark Mode Functionality */
    const toggleDarkMode = () => {
        const body = document.body;
        body.classList.toggle('dark-mode');
        setIsDarkMode(!isDarkMode);
    };

  return (
    <nav className="navbar">
      <div className="navbar-logo">College Planner</div>
      <div className={`navbar-links ${isOpen ? 'open' : ''}`}>
        <ul>
          <li><a href="#home" onClick={handleLinkClick}>Home</a></li>
          <li><a href="#about" onClick={handleLinkClick}>About</a></li>
          <li><a href="#services" onClick={handleLinkClick}>Services</a></li>
          <li><a href="#contact" onClick={handleLinkClick}>Contact</a></li>
          <li>
            <a href="#!" onClick={toggleDarkMode}>
              {isDarkMode ? 'Light Mode' : 'Dark Mode'}
            </a>
          </li>
        </ul>
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
}

export default Navbar;