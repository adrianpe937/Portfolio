import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import '../css/Login.css';

function Login({ setUsername }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log('Datos enviados:', form); // Log para depurar los datos enviados
      const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token); // Guarda el token en localStorage
        const decoded = jwtDecode(data.token); // Decodifica el token
        setUsername(decoded.username); // Actualiza el estado del nombre de usuario en AppContent
        navigate('/perfil'); // Redirige al perfil
      } else {
        setMensaje(data.message || 'Error al iniciar sesión');
      }
    } catch (err) {
      setMensaje('Error al conectar con el servidor');
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Entrar</button>
        </form>
        {mensaje && <p className="error-message">{mensaje}</p>}
      </div>
    </div>
  );
}

export default Login;
