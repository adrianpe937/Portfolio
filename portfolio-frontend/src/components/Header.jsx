import React from "react";

const Header = () => (
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
);

export default Header;
