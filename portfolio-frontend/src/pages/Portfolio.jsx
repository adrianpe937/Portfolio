import React, { useEffect, useState } from 'react';
import '../css/Portfolio.css';

const Portfolio = () => {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const username = 'adrianpe937';

  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=9`);
        const data = await res.json();
        if (Array.isArray(data)) setRepos(data);
      } catch (err) {
        console.error('Error al obtener repositorios:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, [username]);

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <h1>Mi Portfolio</h1>
        <p>¡Hola! Soy <strong>{username}</strong>, un desarrollador junior apasionado por la <strong>ciberseguridad</strong> y el <strong>desarrollo web</strong>.</p>
      </header>

      <section className="about-section fade-in">
        <h2>🧑‍💻 Sobre Mí</h2>
        <p>Soy técnico en sistemas especializado en ciberseguridad, redes y desarrollo web. Actualmente estudio el <strong>FP DAW</strong>, y tengo una base sólida en ASIX y SMX.</p>
        <ul className="skills-list">
          <li>🔐 Pentesting y auditorías Red Team</li>
          <li>🖧 Automatización y administración de redes</li>
          <li>🤖 Arduino y scripting</li>
          <li>🧩 Backend y bases de datos</li>
        </ul>

        <div className="timeline">
          <h3>📍 Experiencia</h3>
          <p><strong>2024 (Ene-Jun):</strong> Prácticas en <em>Seven Sector</em></p>
          <p><strong>2022-2023 (Nov-Mar):</strong> Prácticas en <em>Col·legi Sant Gabriel</em></p>
        </div>

        <div className="education">
          <h3>🎓 Formación</h3>
          <p><strong>2024 - Actual:</strong> DAW, Institut La Pineda</p>
          <p><strong>2022 - 2024:</strong> ASIX (Ciberseguridad), Colegio Cultural Badalona</p>
          <p><strong>2020 - 2022:</strong> SMX, Colegio Cultural Badalona</p>
        </div>
      </section>

      <section className="fade-in">
        <h2>🚀 Repositorios Recientes</h2>
        {loading ? (
          <div className="spinner" aria-label="Cargando repositorios"></div>
        ) : (
          <div className="repos-grid">
            {repos.map(repo => (
              <a
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="repo-card"
                key={repo.id}
              >
                <h3>{repo.name}</h3>
                <p>{repo.description || 'Sin descripción'}</p>
                <div className="repo-details">
                  <span>⭐ {repo.stargazers_count}</span>
                  <span>🍴 {repo.forks_count}</span>
                </div>
              </a>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Portfolio;
