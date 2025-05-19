import React, { useState, useEffect } from "react";
import { FaLaptopCode, FaShieldAlt, FaCode } from "react-icons/fa";

// Iconos de tecnologías con colores personalizados
const TechIcon = ({ tech }) => {
  const colors = {
    CSS3: "#264de4",
    JavaScript: "#f0db4f",
    React: "#61dafb",
    "Node.js": "#3c873a",
    HTML5: "#e34c26"
  };
  
  // Renderizado condicional basado en la tecnología
  return (
    <div className="tech-icon" style={{ backgroundColor: colors[tech] || "#6a3de8" }}>
      {tech.charAt(0)}
    </div>
  );
};

// Lista de tecnologías
const technologies = [
  { title: "CSS3" },
  { title: "JavaScript" },
  { title: "React" },
  { title: "Node.js" },
  { title: "HTML5" },
  { title: "TypeScript" },
  { title: "Next.js" },
  { title: "MongoDB" }
];

const features = [
  { icon: <FaLaptopCode />, title: "CSS3" },
  { icon: <FaShieldAlt />, title: "JavaScript" },
  { icon: <FaCode />, title: "React"},
  { icon: <FaCode />, title: "Node.js" },
  { icon: <FaCode />, title: "HTML5" }
];

const Features = () => {
  // Estado para controlar la pausa al pasar el ratón
  const [isPaused, setIsPaused] = useState(false);
  
  return (
    <div className="tech-showcase">
      <h2 className="tech-showcase-title">Tecnologías</h2>
      <p> Slider donde se muestran las tecnologias que he usado en mis proyectos</p>
      <div 
        className={`tech-marquee ${isPaused ? 'paused' : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="tech-track">
          {[...technologies, ...technologies, ...technologies].map((tech, index) => (
            <div className="tech-item" key={`${tech.title}-${index}`}>
              <TechIcon tech={tech.title} />
              <span className="tech-name">{tech.title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Features;