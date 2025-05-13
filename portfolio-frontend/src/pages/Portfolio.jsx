import React, { useState, useEffect } from 'react';
import '../css/Portfolio.css';

const Portfolio = () => {
  const [portfolioData, setPortfolioData] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/portfolio');
        if (!response.ok) throw new Error('Error al obtener los datos del portfolio');
        const data = await response.json();
        setPortfolioData(data);
      } catch (error) {
        console.error('Error al obtener los datos del portfolio:', error);
      }
    };

    fetchPortfolioData();
  }, []);

  const handleContentChange = async (id, newContent) => {
    try {
      const updatedSection = portfolioData.find((item) => item._id === id);
      updatedSection.content = newContent;

      const response = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedSection),
      });

      if (!response.ok) throw new Error('Error al actualizar el contenido');

      setPortfolioData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, content: newContent } : item
        )
      );
    } catch (error) {
      console.error('Error al actualizar el contenido:', error);
    }
  };

  const handleAdd = async () => {
    try {
      const newSection = { section: 'Nueva Sección', content: 'Nuevo contenido...' };
      const response = await fetch('http://localhost:5000/api/portfolio', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection),
      });

      if (!response.ok) throw new Error('Error al agregar una nueva sección');

      const data = await response.json();
      setPortfolioData([...portfolioData, data.data]);
    } catch (error) {
      console.error('Error al agregar una nueva sección:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/portfolio/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar la sección');

      setPortfolioData(portfolioData.filter((item) => item._id !== id));
    } catch (error) {
      console.error('Error al eliminar la sección:', error);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <h1>Mi Portfolio</h1>
        <p>
          ¡Hola! Soy <strong>adrianpe937</strong>, un desarrollador junior apasionado por la <strong>ciberseguridad</strong> y el <strong>desarrollo web</strong>.
        </p>
        <div className="top-buttons">
          <button onClick={handleEditToggle}>
            {isEditing ? 'Guardar cambios' : 'Editar contenido'}
          </button>
          <button onClick={handleAdd}>Agregar sección</button>
        </div>
      </header>

      <section className="portfolio-sections">
        {portfolioData.map(({ _id, section, content }) => (
          <div key={_id} className="portfolio-section">
            <h3>{section}</h3>
            <p
              contentEditable={isEditing}
              suppressContentEditableWarning={true}
              onBlur={(e) => handleContentChange(_id, e.target.textContent)}
              style={{ backgroundColor: isEditing ? '#f4f4f4' : 'transparent', padding: '0.3em' }}
            >
              {content}
            </p>
            {isEditing && (
              <button className="delete-btn" onClick={() => handleDelete(_id)}>
                Eliminar sección
              </button>
            )}
          </div>
        ))}
      </section>
    </div>
  );
};

export default Portfolio;
