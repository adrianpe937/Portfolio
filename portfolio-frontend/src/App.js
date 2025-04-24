import './App.css';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';

function App() {
  const [username, setUsername] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
      } catch (error) {
        setUsername('');
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    
  };

  const handleUsernameUpdate = (newUsername) => {
    setUsername(newUsername); // Función para actualizar el nombre de usuario
  };

  return (
    <Router>
      <nav>
        <div className="nav-links">
          <Link to="/register">Registro</Link>
          {!username && <Link to="/login">Login</Link>}
          <Link to="/usuarios">Usuarios</Link>
          {username && <Link to="/perfil">Perfil</Link>}
        </div>
        {username && (
          <span className="user-info">👋 Hola, {username}</span>
        )}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route
          path="/perfil"
          element={<Perfil handleLogout={handleLogout} handleUsernameUpdate={handleUsernameUpdate} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
