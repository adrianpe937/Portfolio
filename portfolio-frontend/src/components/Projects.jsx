import React, { useState, useEffect } from "react";
import { FaExternalLinkAlt, FaInfoCircle } from "react-icons/fa";

// Cambia esto por tu usuario real de GitHub si es diferente
const GITHUB_USERNAME = "adrianpe937";

// Asocia aquí el nombre del repo con la imagen que quieras mostrar
const projectImages = {
  "portfolio": "https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=600&q=80",
  "ciberseguridad": "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=600&q=80",
  "web-app": "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=600&q=80",
  // Añade aquí más repos y sus imágenes personalizadas
};

// Imagen por defecto si no hay personalizada
const defaultProjectImage = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80";

const marsStudioProject = {
  title: "Web de Pilates",
  link: "https://mars-studio.es/",
  techs: ["Wordpress", "CSS", "JavaScript"],
  desc: "Diseño y desarrollo de un sitio web para un estudio de pilates",
  classImage: "project-image"
};

const Projects = () => {
  const [githubProjects, setGithubProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [flipped, setFlipped] = useState({});

  useEffect(() => {
    setLoading(true);
    fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?per_page=100&sort=updated`)
      .then(res => {
        if (!res.ok) throw new Error("No se pudieron cargar los proyectos de GitHub");
        return res.json();
      })
      .then(data => {
        const filtered = data.filter(repo => !repo.fork);
        setGithubProjects(filtered);
        setLoading(false);
      })
      .catch(err => {
        setError("Error al cargar los proyectos de GitHub");
        setLoading(false);
      });
  }, []);

  const handleFlip = idx => {
    setFlipped(f => ({ ...f, [idx]: !f[idx] }));
  };

  // Helper para obtener la imagen del proyecto
  const getProjectImage = (repo) => {
    // Busca por nombre exacto o por slug (sin espacios, minúsculas)
    const key = repo.name.toLowerCase().replace(/\s+/g, "-");
    return (
      projectImages[repo.name] ||
      projectImages[key] ||
      defaultProjectImage
    );
  };

  return (
    <>
      <h2 className="section-title">Proyectos Destacados</h2>
      {loading && <div style={{ textAlign: "center", margin: "2rem" }}>Cargando proyectos de GitHub...</div>}
      {error && <div style={{ color: "red", textAlign: "center" }}>{error}</div>}
      <div className="projects-grid">
        {/* Proyectos de GitHub */}
        {githubProjects.map((repo, idx) => (
          <div
            className={`project-card flip-card${flipped["gh"+idx] ? " flipped" : ""}`}
            key={repo.id}
            tabIndex={0}
            onMouseEnter={() => setTimeout(() => setFlipped(f => ({ ...f, ["gh"+idx]: true })), 120)}
            onMouseLeave={() => setTimeout(() => setFlipped(f => ({ ...f, ["gh"+idx]: false })), 120)}
            onFocus={() => setFlipped(f => ({ ...f, ["gh"+idx]: true }))}
            onBlur={() => setFlipped(f => ({ ...f, ["gh"+idx]: false }))}
            style={{
              transition: "box-shadow 0.7s cubic-bezier(.23,1,.32,1), transform 0.7s cubic-bezier(.23,1,.32,1)",
            }}
          >
            <div className="flip-card-inner">
              {/* Front */}
              <div className="flip-card-front">
                <div
                  className="project-image"
                  style={{
                    backgroundImage: `url(${getProjectImage(repo)})`,
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    height: "200px"
                  }}
                >
                  <div className="project-overlay">
                    <h4>{repo.name}</h4>
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer" className="project-link">
                      <FaExternalLinkAlt /> Ver proyecto
                    </a>
                  </div>
                </div>
                <div className="project-info">
                  <h4>{repo.name}</h4>
                  <div className="project-tech">
                    {repo.language && <span>{repo.language}</span>}
                  </div>
                  <button
                    className="project-flip-btn"
                    type="button"
                    aria-label="Ver explicación"
                    onClick={e => {
                      e.stopPropagation();
                      handleFlip("gh"+idx);
                    }}
                  >
                    <FaInfoCircle /> Info
                  </button>
                </div>
              </div>
              {/* Back */}
              <div className="flip-card-back">
                <div className="project-back-content">
                  <h4>{repo.name}</h4>
                  <p>{repo.description || "Sin descripción"}</p>
                  <a
                    href={repo.html_url}
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
                      handleFlip("gh"+idx);
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
      {/* Otros proyectos */}
      <h2 className="section-title" style={{ marginTop: "3rem" }}>Otros proyectos</h2>
      <div className="projects-grid">
        <div
          className={`project-card flip-card${flipped["mars"] ? " flipped" : ""}`}
          tabIndex={0}
          onMouseEnter={() => setTimeout(() => setFlipped(f => ({ ...f, mars: true })), 120)}
          onMouseLeave={() => setTimeout(() => setFlipped(f => ({ ...f, mars: false })), 120)}
          onFocus={() => setFlipped(f => ({ ...f, mars: true }))}
          onBlur={() => setFlipped(f => ({ ...f, mars: false }))}
          style={{
            transition: "box-shadow 0.7s cubic-bezier(.23,1,.32,1), transform 0.7s cubic-bezier(.23,1,.32,1)",
          }}
        >
          <div className="flip-card-inner">
            {/* Front */}
            <div className="flip-card-front">
              <div className={marsStudioProject.classImage}>
                <div className="project-overlay">
                  <h4>{marsStudioProject.title}</h4>
                  <a href={marsStudioProject.link} target="_blank" rel="noopener noreferrer" className="project-link">
                    <FaExternalLinkAlt /> Ver proyecto
                  </a>
                </div>
              </div>
              <div className="project-info">
                <h4>{marsStudioProject.title}</h4>
                <div className="project-tech">
                  {marsStudioProject.techs.map(tech => <span key={tech}>{tech}</span>)}
                </div>
                <button
                  className="project-flip-btn"
                  type="button"
                  aria-label="Ver explicación"
                  onClick={e => {
                    e.stopPropagation();
                    handleFlip("mars");
                  }}
                >
                  <FaInfoCircle /> Info
                </button>
              </div>
            </div>
            {/* Back */}
            <div className="flip-card-back">
              <div className="project-back-content">
                <h4>{marsStudioProject.title}</h4>
                <p>{marsStudioProject.desc}</p>
                <a
                  href={marsStudioProject.link}
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
                    handleFlip("mars");
                  }}
                >
                  Volver
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Projects;
