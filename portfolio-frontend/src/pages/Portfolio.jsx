import React, { useState, useEffect } from 'react';
import '../css/Portfolio.css';
import {
  FaCode,
  FaLaptopCode,
  FaShieldAlt,
  FaEdit,
  FaPlus,
  FaTrash,
  FaExternalLinkAlt,
} from 'react-icons/fa';

const Portfolio = () => {
  // =======================
  // Estados
  // =======================
  const [portfolioData, setPortfolioData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [error, setError] = useState(null); // Estado para manejar errores
  const tokenGuardado = localStorage.getItem('token');

  // =======================
  // Efectos
  // =======================
  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/portfolio', {
          headers: {
            'Authorization': `Bearer ${tokenGuardado}`, // Asegúrate de que el token se envíe correctamente
          },
        });
        if (!response.ok) throw new Error('Error al obtener los datos del portfolio');
        const data = await response.json();
        setPortfolioData(data);
      } catch (error) {
        setError('Error al obtener los datos del portfolio'); // Guardamos el error en el estado
        console.error('Error al obtener los datos del portfolio:', error);
      }
    };

    fetchPortfolioData();

    // Detectar modo oscuro por defecto
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setDarkMode(prefersDarkMode);
  }, []);

  // =======================
  // Funciones auxiliares
  // =======================
  const getSectionIcon = (title) => {
    const lower = title.toLowerCase();
    if (lower.includes('seguridad') || lower.includes('ciber')) return <FaShieldAlt className="section-icon" />;
    if (lower.includes('desarrollo') || lower.includes('web')) return <FaLaptopCode className="section-icon" />;
    return <FaCode className="section-icon" />;
  };

  // =======================
  // Handlers
  // =======================
  const handleContentChange = async (id, newContent) => {
    try {
      const updated = portfolioData.find((item) => item._id === id);
      updated.content = newContent;

      const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });

      if (!res.ok) throw new Error('Error al actualizar el contenido');

      setPortfolioData((prev) =>
        prev.map((item) => item._id === id ? { ...item, content: newContent } : item)
      );
    } catch (error) {
      console.error('Error al actualizar el contenido:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const newSection = { section: 'Nueva Sección', content: 'Nuevo contenido...' };
      const res = await fetch('http://localhost:5000/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${tokenGuardado}`,
        },
        body: JSON.stringify(newSection),
      });

      if (!res.ok) throw new Error('Error al agregar una nueva sección');

      const data = await res.json();
      setPortfolioData([...portfolioData, data.data]);
    } catch (error) {
      console.error('Error al agregar una nueva sección:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (!res.ok) throw new Error('Error al eliminar la sección');

      setPortfolioData(portfolioData.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error al eliminar la sección:', error);
    }
  };

  const handleEditToggle = () => setIsEditing(!isEditing);
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle('dark-mode');
  };

  // =======================
  // Render
  // =======================
  return (
    <div className={`portfolio-container ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Banner principal */}
      <div className="hero-banner">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="animated-title">Mi Portfolio</h1>
          <p className="hero-subtitle">Desarrollo Web & Ciberseguridad</p>
        </div>
      </div>

      {/* Botón de modo oscuro */}
      <button
        className="theme-toggle"
        onClick={toggleDarkMode}
        aria-label={darkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
      >
        {darkMode ? "☀️" : "🌙"}
      </button>

      {/* Acerca de mí */}
      <header className="portfolio-header">
        <div className="avatar-container">
          <div className="avatar">
            <div className="avatar-placeholder">AP</div>
          </div>
        </div>

        <div className="header-content">
          <h2>Acerca de mí</h2>
          <p className="bio">
            ¡Hola! Soy <strong>adrianpe937</strong>, un desarrollador junior apasionado por la <strong>ciberseguridad</strong> y el <strong>desarrollo web</strong>.
          </p>

          <div className="skills-container">
            {['HTML5', 'CSS3', 'JavaScript', 'React', 'Node.js', 'Ciberseguridad'].map(skill => (
              <div key={skill} className="skill-tag">{skill}</div>
            ))}
          </div>

          <div className="top-buttons">
            <button className="edit-button" onClick={handleEditToggle}>
              <FaEdit className="button-icon" />
              {isEditing ? 'Guardar cambios' : 'Editar contenido'}
            </button>
            <button className="add-button" onClick={handleAdd}>
              <FaPlus className="button-icon" />
              Agregar sección
            </button>
          </div>
        </div>
      </header>

      {/* Características destacadas */}
      <div className="features-grid">
        {[
          { icon: <FaLaptopCode />, title: "Desarrollo Web", text: "Creación de sitios web modernos y aplicaciones con React" },
          { icon: <FaShieldAlt />, title: "Ciberseguridad", text: "Análisis de vulnerabilidades y protección de aplicaciones" },
          { icon: <FaCode />, title: "Programación", text: "JavaScript, Python y otras tecnologías modernas" }
        ].map(({ icon, title, text }) => (
          <div className="feature-card" key={title}>
            <div className="feature-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{text}</p>
          </div>
        ))}
      </div>

      {/* Secciones dinámicas de experiencia */}
      <section>
        <h2 className="section-title">Mi Experiencia</h2>
        {error ? (
          <p className="error-message">{error}</p> // Mostrar mensaje de error
        ) : portfolioData.length > 0 ? (
          portfolioData.map(({ _id, section, content, index }) => (
            <div >
              <div>
                {getSectionIcon(section)}
                <h3>{section}</h3>
              </div>
              <div className="section-content-wrapper">
                <p
                  className={`section-content ${isEditing ? 'editing' : ''}`}
                  contentEditable={isEditing}
                  suppressContentEditableWarning={true}
                  onBlur={(e) => handleContentChange(_id, e.target.textContent)}
                >
                  {content}
                </p>
                {isEditing && (
                  <button className="delete-btn" onClick={() => handleDelete(_id)}>
                    <FaTrash className="button-icon" /> Eliminar
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>Cargando datos del portfolio...</p>
        )}
      </section>

      {/* Proyectos destacados */}
      <h2 className="section-title">Proyectos Destacados</h2>
      <div className="projects-grid">
        {[
          {
            title: "Web de Pilates",
            link: "https://mars-studio.es/",
            techs: ["HTML", "CSS", "JavaScript"],
            desc: "Diseño y desarrollo de un sitio web para un estudio de pilates",
            classImage: "project-image"
          },
          {
            title: "Portafolio Personal",
            link: "#",
            techs: ["React", "Node.js", "CSS"],
            desc: "Mi sitio web personal construido con React y Node.js",
            classImage: "project-image project-image-2"
          }
        ].map(({ title, link, techs, desc, classImage }) => (
          <div className="project-card" key={title}>
            <div className={classImage}>
              <div className="project-overlay">
                <h4>{title}</h4>
                <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
                  <FaExternalLinkAlt /> Ver proyecto
                </a>
              </div>
            </div>
            <div className="project-info">
              <h4>{title}</h4>
              <p>{desc}</p>
              <div className="project-tech">
                {techs.map(tech => <span key={tech}>{tech}</span>)}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Contacto */}
      <div className="contact-section">
        <h2>¿Interesado en trabajar juntos?</h2>
        <p>Me encantaría colaborar en tu próximo proyecto</p>
        <a href="mailto:contacto@ejemplo.com" className="contact-button">Contáctame</a>
        <div className="social-links">
          <a href="https://github.com/tuusuario" target="_blank" rel="noopener noreferrer" className="social-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" stroke="currentColor" fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M9 19c-5 1.5-5-3-5-3s0-6 5-7.5 5 3 5 3-1 5.5-5 7.5z"></path>
              <path d="M15 3c-4 1.5-4 3-4 3s0 5 4 6.5 4-3 4-3-1-5.5-4-6.5z"></path>
            </svg>
          </a>
        </div>
      </div>
      </div>
);
};

export default Portfolio;
