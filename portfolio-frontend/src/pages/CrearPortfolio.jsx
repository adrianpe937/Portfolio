import React, { useState } from 'react';
import '../css/crearportfolio.css';

function CrearPortfolio() {
  const [formData, setFormData] = useState({
    nombre: '',
    bio: '',
    tecnologias: '',
    experiencia: '',
    formacion: ''
  });

  // Esta función maneja el cambio de los valores del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Función para generar el portfolio con los datos del formulario
  const generarPortfolio = () => {
    // Guardamos los datos en LocalStorage
    localStorage.setItem('portfolio', JSON.stringify(formData));
    alert("Portfolio creado con éxito! Ahora puedes verlo.");
  };

  return (
    <div className="crear-portfolio-container">
      <header className="crear-portfolio-header">
        <h1>Crear Tu Propio Portfolio</h1>
        <p>Introduce tu información y genera tu portfolio personal.</p>
      </header>

      <section className="form-section">
        <h2>📄 Formulario</h2>
        <div className="form">
          <input 
            type="text" 
            name="nombre" 
            placeholder="Tu nombre" 
            onChange={handleChange} 
          />
          <textarea 
            name="bio" 
            placeholder="Breve biografía" 
            onChange={handleChange} 
          ></textarea>
          <input 
            type="text" 
            name="tecnologias" 
            placeholder="Tecnologías que usas" 
            onChange={handleChange} 
          />
          <textarea 
            name="experiencia" 
            placeholder="Experiencia" 
            onChange={handleChange} 
          ></textarea>
          <textarea 
            name="formacion" 
            placeholder="Formación académica" 
            onChange={handleChange} 
          ></textarea>
          <button onClick={generarPortfolio}>Generar Portfolio</button>
        </div>
      </section>
    </div>
  );
}

export default CrearPortfolio;
