import React from "react";
import { FaLaptopCode, FaShieldAlt, FaCode } from "react-icons/fa";

const features = [
  { icon: <FaLaptopCode />, title: "Desarrollo Web", text: "Creación de sitios web modernos y aplicaciones con React" },
  { icon: <FaShieldAlt />, title: "Ciberseguridad", text: "Análisis de vulnerabilidades y protección de aplicaciones" },
  { icon: <FaCode />, title: "Programación", text: "JavaScript, Python y otras tecnologías modernas" }
];

const Features = () => (
  <div className="features-grid">
    {features.map(({ icon, title, text }) => (
      <div className="feature-card" key={title}>
        <div className="feature-icon">{icon}</div>
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    ))}
  </div>
);

export default Features;
