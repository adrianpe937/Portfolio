import { useState } from 'react';
import axios from 'axios';

function AlertaEmpleo() {
  const [email, setEmail] = useState('');
  const [keywords, setKeywords] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/alerta-empleo', { email, keywords });
      alert('Alerta configurada con éxito. Te avisaremos por correo cuando haya ofertas.');
    } catch (error) {
      alert('Error al configurar la alerta.');
    }
  };

  return (
    <div className="alerta-empleo-container">
      <h2>Recibe ofertas de trabajo por correo</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tu correo de Gmail:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          ¿Qué tipo de trabajo buscas?
          <input
            type="text"
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            placeholder="Ej: Técnico informático, desarrollador..."
            required
          />
        </label>
        <button type="submit">Guardar alerta</button>
      </form>
    </div>
  );
}

export default AlertaEmpleo;
