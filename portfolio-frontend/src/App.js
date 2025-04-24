import './App.css';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';
import Portfolio from './pages/Portfolio';
import CrearPortfolio from './pages/CrearPortfolio';

function App() {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false); // Nuevo estado para manejar el rol de admin

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        setIsAdmin(decoded.isAdmin); // Extraemos isAdmin del token
      } catch (error) {
        setUsername('');
        setIsAdmin(false);
      }
    }
  }, []);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setIsAdmin(false); // Limpiamos el estado de admin al hacer logout
  };

  const handleUsernameUpdate = (newUsername) => {
    setUsername(newUsername); // Función para actualizar el nombre de usuario
  };

  return (
    <Router>
      <nav>
        <div className="nav-links">
          {!username && <Link to="/register">Registro</Link>}
          {!username && <Link to="/login">Login</Link>}
          {isAdmin && <Link to="/usuarios">Usuarios</Link>} {/* Solo visible si es admin */}
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/crear-portfolio">Crea tu propio Portfolio</Link>
          {username && <Link to="/perfil">Perfil</Link>}
        </div>
        {username && (
          <span className="user-info">👋 Hola, {username}</span>
        )}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        {isAdmin && <Route path="/usuarios" element={<Usuarios />} />} {/* Solo visible si es admin */}
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/crear-portfolio" element={<CrearPortfolio />} />
        <Route
          path="/perfil"
          element={<Perfil handleLogout={handleLogout} handleUsernameUpdate={handleUsernameUpdate} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
