import React, { useState, useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
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
      AOS.init({ duration: 1000 });
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


  const renderEditableContent = (section, content, _id) => {
  if (typeof content === 'string') {
    return (
      <p
        className={`section-content ${isEditing ? 'editing' : ''}`}
        contentEditable={isEditing}
        suppressContentEditableWarning={true}
        onBlur={(e) => handleContentChange(_id, e.target.textContent)}
      >
        {content}
      </p>
    );
  }

  if (Array.isArray(content)) {
    // Experiencia
    if (section === 'Experiencia') {
      return content.map((item, idx) => (
        <div key={idx} className="experience-block">
          <h4
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleNestedContentChange(_id, idx, 'titulo', e.target.textContent)}
          >
            {item.titulo}
          </h4>
          <p
            className="experience-date"
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleNestedContentChange(_id, idx, 'fecha', e.target.textContent)}
          >
            {item.fecha}
          </p>
          <ul>
            {item.descripcion.map((desc, i) => (
              <li
                key={i}
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) =>
                  handleNestedDescriptionChange(_id, idx, i, e.target.textContent)
                }
              >
                {desc}
              </li>
            ))}
          </ul>
        </div>
      ));
    }

    // Formación
    if (section === 'Formación') {
      return content.map((item, idx) => (
        <div key={idx} className="formacion-block">
          <h4
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleNestedContentChange(_id, idx, 'titulo', e.target.textContent)}
          >
            {item.titulo}
          </h4>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) => handleNestedContentChange(_id, idx, 'fecha', e.target.textContent)}
          >
            {item.fecha}
          </p>
          <p
            contentEditable={isEditing}
            suppressContentEditableWarning={true}
            onBlur={(e) =>
              handleNestedContentChange(_id, idx, 'descripcion', e.target.textContent)
            }
          >
            {item.descripcion}
          </p>
        </div>
      ));
    }

    // Idiomas
    if (section === 'Idiomas') {
      return (
        <ul>
          {content.map((idioma, idx) => (
            <li key={idx}>
              <strong
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) =>
                  handleNestedContentChange(_id, idx, 'idioma', e.target.textContent)
                }
              >
                {idioma.idioma}
              </strong>
              :{" "}
              <span
                contentEditable={isEditing}
                suppressContentEditableWarning={true}
                onBlur={(e) =>
                  handleNestedContentChange(_id, idx, 'nivel', e.target.textContent)
                }
              >
                {idioma.nivel}
              </span>
            </li>
          ))}
        </ul>
      );
    }
  }

  return null;
};



//CONTENIDO ANINADO/////////////////

const handleNestedContentChange = (id, index, field, newValue) => {
  setPortfolioData((prevData) =>
    prevData.map((item) => {
      if (item._id === id) {
        const newContent = [...item.content];
        newContent[index] = {
          ...newContent[index],
          [field]: newValue,
        };
        return { ...item, content: newContent };
      }
      return item;
    })
  );
};

const handleNestedDescriptionChange = (id, itemIndex, descIndex, newValue) => {
  setPortfolioData((prevData) =>
    prevData.map((item) => {
      if (item._id === id) {
        const newContent = [...item.content];
        const newDesc = [...newContent[itemIndex].descripcion];
        newDesc[descIndex] = newValue;
        newContent[itemIndex] = {
          ...newContent[itemIndex],
          descripcion: newDesc,
        };
        return { ...item, content: newContent };
      }
      return item;
    })
  );
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
     <section data-aos="fade-up">
        <h2 className="section-title">Mi Experiencia</h2>

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

        {error ? (
          <p className="error-message">{error}</p>
        ) : portfolioData.length > 0 ? (
          portfolioData.map(({ _id, section, content, index, imageUrl }, i) => (
            <div
              className="experience-card"
              key={_id}
              data-aos="fade-up"
              data-aos-delay={i * 100}
              style={{ "--i": i }}
            >
              {/* Contenedor para imagen */}
              <div className="experience-image">
                {imageUrl ? (
                  <img src={imageUrl} alt={section} />
                ) : (
                  <div className="experience-image-placeholder">
                    {section.charAt(0)}
                  </div>
                )}
              </div>

              <div className="experience-content">
                <div className="experience-header">
                  <div className="experience-icon">
                    {getSectionIcon(section)}
                  </div>
                  <h3 className="experience-title">{section}</h3>
                </div>

                <div className="section-content-wrapper">
                  {renderEditableContent(section, content, _id)}

                  {isEditing && (
                    <div className="experience-actions">
                      <button className="delete-btn" onClick={() => handleDelete(_id)}>
                        <FaTrash className="button-icon" /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="loading-state" data-aos="fade-up">
            <div className="loading-spinner"></div>
            <p>Cargando datos del portfolio...</p>
          </div>
        )}
      </section>


      {/* Proyectos destacados */}
      <h2 className="section-title">Proyectos Destacados</h2>
      <div className="projects-grid">
        {[
          {
            title: "Web de Pilates",
            link: "https://mars-studio.es/",
            techs: ["Wordpress", "CSS", "JavaScript"],
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
