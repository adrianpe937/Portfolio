import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/Register.css'; // Importamos el CSS

function Register() {
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    try {
      const res = await fetch('http://localhost:5000/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (res.ok) {
        navigate('/login');
      } else {
        setMensaje(data.message || 'Error en el registro');
      }
    } catch (err) {
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <h2>Registro</h2>
        <form onSubmit={handleSubmit}>
          <input
            name="username"
            placeholder="Usuario de Github"
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            onChange={handleChange}
            required
          />
          <button type="submit">Registrarse</button>
        </form>
        {mensaje && <p className="error-message">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Register;
