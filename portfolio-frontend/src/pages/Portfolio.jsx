import React, { useState, useEffect, useRef } from 'react';
import '../css/Portfolio.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ExperienceSection from '../components/ExperienceSection';
import Header from '../components/Header';
import Features from '../components/Features';
import Projects from '../components/Projects';
import ContactSection from '../components/ContactSection';
import usePortfolioLogic from '../hooks/usePortfolioLogic';

const Portfolio = () => {
  const logic = usePortfolioLogic();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  return (
    <div
      className={`portfolio-container ${logic.darkMode ? 'dark-mode' : 'light-mode'}`}
      onMouseMove={logic.handleDrag}
      onMouseUp={logic.handleDragEnd}
      style={{ position: "relative" }}
    >
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animated-title">Mi Portfolio</h1>
          <p className="hero-subtitle">Desarrollo Web & Ciberseguridad</p>
        </div>
      </div>
      <button
        className="theme-toggle"
        onClick={logic.toggleDarkMode}
        aria-label={logic.darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {logic.darkMode ? "☀️" : "🌙"}
      </button>
      <Header />
      <Features />
      <ExperienceSection {...logic} />
      <Projects />
      <ContactSection />
    </div>
  );
};

export default Portfolio;