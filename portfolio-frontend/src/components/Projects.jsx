import React, { useState } from "react";
import { FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";

const projects = [
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
];

const Projects = () => {
  const [flipped, setFlipped] = useState({});

  const handleFlip = idx => {
    setFlipped(f => ({ ...f, [idx]: !f[idx] }));
  };

  return (
    <>
      <h2 className="section-title">Proyectos Destacados</h2>
      <div className="projects-grid">
        {projects.map(({ title, link, techs, desc, classImage }, idx) => (
          <div
            className={`project-card flip-card${flipped[idx] ? " flipped" : ""}`}
            key={title}
            tabIndex={0}
            onMouseEnter={() => setTimeout(() => setFlipped(f => ({ ...f, [idx]: true })), 120)}
            onMouseLeave={() => setTimeout(() => setFlipped(f => ({ ...f, [idx]: false })), 120)}
            onFocus={() => setFlipped(f => ({ ...f, [idx]: true }))}
            onBlur={() => setFlipped(f => ({ ...f, [idx]: false }))}
            style={{
              // Sombra y escala extra en hover para más "punch"
              transition: "box-shadow 0.7s cubic-bezier(.23,1,.32,1), transform 0.7s cubic-bezier(.23,1,.32,1)",
            }}
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front">
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
                  <div className="project-tech">
                    {techs.map(tech => <span key={tech}>{tech}</span>)}
                  </div>
                  <button
                    className="project-flip-btn"
                    type="button"
                    aria-label="Ver explicación"
                    onClick={e => {
                      e.stopPropagation();
                      handleFlip(idx);
                    }}
                  >
                    <FaInfoCircle /> Info
                  </button>
                </div>
              </div>
              {/* Back */}
              <div className="flip-card-back">
                <div className="project-back-content">
                  <h4>{title}</h4>
                  <p>{desc}</p>
                  <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-back-link"
                  >
                    <FaExternalLinkAlt /> Ver proyecto
                  </a>
                  <button
                    className="project-flip-btn"
                    type="button"
                    aria-label="Volver"
                    onClick={e => {
                      e.stopPropagation();
                      handleFlip(idx);
                    }}
                  >
                    Volver
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Projects;
