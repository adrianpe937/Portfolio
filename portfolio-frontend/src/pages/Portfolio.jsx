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
              <span className="skill-tag">Desarrollo Web</span>
              <span className="skill-tag">Ciberseguridad</span>
              <span className="skill-tag">Programación</span>
              <span className="skill-tag">Redes</span>
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
      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-links">
          <a href="mailto:adrianpe937@gmail.com">Email</a>
          <a href="https://github.com/adrianpe937" target="_blank" rel="noopener noreferrer">GitHub</a>
          <a href="https://www.linkedin.com/in/adrianpe937/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
        </div>
        <div className="footer-social">
          <a href="https://github.com/adrianpe937" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.387.6.113.82-.26.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.757-1.333-1.757-1.09-.745.082-.729.082-.729 1.205.086 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.3-5.467-1.332-5.467-5.931 0-1.31.467-2.382 1.235-3.22-.123-.303-.535-1.522.117-3.176 0 0 1.008-.322 3.3 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.043.137 3.003.404 2.29-1.552 3.296-1.23 3.296-1.23.653 1.654.241 2.873.118 3.176.77.838 1.233 1.91 1.233 3.22 0 4.61-2.807 5.628-5.48 5.922.43.37.823 1.102.823 2.222v3.293c0 .32.218.694.825.576C20.565 21.796 24 17.298 24 12c0-6.63-5.37-12-12-12z"/></svg>
          </a>
          <a href="https://www.linkedin.com/in/adrianpe937/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.784-1.75-1.75s.784-1.75 1.75-1.75 1.75.784 1.75 1.75-.784 1.75-1.75 1.75zm13.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.841-1.563 3.039 0 3.6 2.001 3.6 4.601v5.595z"/></svg>
          </a>
        </div>
        <small>
          © {new Date().getFullYear()} Adrian Peña.
        </small>
      </footer>
    </div>
  );
};

export default Portfolio;