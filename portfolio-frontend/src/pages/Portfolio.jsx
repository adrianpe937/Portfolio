import React, { useState, useEffect, useRef } from 'react';
import '../css/Portfolio.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
import ExperienceSection from '../components/ExperienceSection';
import Features from '../components/Features';
import Projects from '../components/Projects';
import ContactSection from '../components/ContactSection';
import usePortfolioLogic from '../hooks/usePortfolioLogic';

const scrollToSection = (id) => {
  const el = document.getElementById(id);
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
};

const Portfolio = () => {
  const logic = usePortfolioLogic();

  useEffect(() => {
    AOS.init({ duration: 1000 });
    // Scroll suave global para todos los navegadores
    document.documentElement.style.scrollBehavior = 'smooth';
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);

  return (
    <div
      className={`portfolio-container ${logic.darkMode ? 'dark-mode' : 'light-mode'}`}
      onMouseMove={logic.handleDrag}
      onMouseUp={logic.handleDragEnd}
      style={{ position: "relative" }}
    >
      <div className="hero-banner" id="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animated-title">Mi Portfolio</h1>
          <p className="hero-subtitle">Desarrollo Web & Ciberseguridad</p>
          {/* Botón para bajar suavemente a Acerca de mí */}
          <a
            href="#about"
            className="scroll-down-link"
            onClick={e => {
              e.preventDefault();
              scrollToSection('about');
            }}
          >
            <span className="scroll-down-text">Acerca de mí</span>
            <span className="scroll-down-arrow">↓</span>
          </a>
        </div>
      </div>
      <button
        className="theme-toggle"
        onClick={logic.toggleDarkMode}
        aria-label={logic.darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {logic.darkMode ? "☀️" : "🌙"}
      </button>
      {/* Sección Acerca de mí */}
      <section id="about" className="about-section" data-aos="fade-up">
        <div className="portfolio-header">
          <div className="header-content">
            <h2>Acerca de mí</h2>
            <p className="bio">
              ¡Hola! Soy <strong>adrianpe937</strong>, un desarrollador junior apasionado por la <strong>ciberseguridad</strong> y el <strong>desarrollo web</strong>. Me encanta aprender nuevas tecnologías y crear soluciones modernas y seguras. 
              <br /><br />
              Tengo experiencia en el desarrollo de aplicaciones web con <strong>React</strong> y <strong>Node.js</strong>, así como en la implementación de buenas prácticas de seguridad. Mi objetivo es seguir creciendo profesionalmente y aportar valor en proyectos innovadores.
            </p>
            <div className="skills-container">
              <span className="skill-tag">HTML5</span>
              <span className="skill-tag">CSS3</span>
              <span className="skill-tag">JavaScript</span>
              <span className="skill-tag">React</span>
              <span className="skill-tag">Node.js</span>
              <span className="skill-tag">Ciberseguridad</span>
            </div>
          </div>
        </div>
      </section>
      {/* Sección Tecnologías */}
      <section id="tech">
        <Features />
      </section>
      {/* Sección Mi experiencia */}
      <section id="experience">
        <ExperienceSection {...logic} />
      </section>
      {/* Sección Proyectos Destacados */}
      <section id="projects">
        <Projects />
      </section>
      {/* Sección Contacto */}
      <section id="contact">
        <ContactSection />
      </section>
    </div>
  );
};

export default Portfolio;