import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";

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

const Projects = () => (
  <>
    <h2 className="section-title">Proyectos Destacados</h2>
    <div className="projects-grid">
      {projects.map(({ title, link, techs, desc, classImage }) => (
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
  </>
);

export default Projects;
