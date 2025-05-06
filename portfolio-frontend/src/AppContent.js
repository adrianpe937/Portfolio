import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { useEffect, useState } from 'react';
import Register from './pages/Register';
import Login from './pages/Login';
import Users from './pages/Usuarios';
import Perfil from './pages/Perfil';
import Portfolio from './pages/Portfolio';
import AlertaEmpleo from './pages/AlertaEmpleo';
import Dashboard from './pages/Dashboard';
import useDarkMode from './hooks/useDarkMode';

function AppContent() {
  const [username, setUsername] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingUser, setLoadingUser] = useState(true);
  const navigate = useNavigate();
  const [theme, toggleTheme] = useDarkMode();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUsername(decoded.username);
        setIsAdmin(decoded.isAdmin);
      } catch (error) {
        setUsername('');
        setIsAdmin(false);
      }
    }
    setLoadingUser(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUsername('');
    setIsAdmin(false);
    navigate('/login');
  };

  const handleUsernameUpdate = (newUsername) => {
    setUsername(newUsername);
  };

  return (
    <>
      <nav>
        <div className="nav-links">
          {!username && <Link to="/register">Registro</Link>}
          {!username && <Link to="/login">Login</Link>}
          {isAdmin && <Link to="/usuarios">Usuarios</Link>}
          <Link to="/portfolio">Portfolio</Link>
          <Link to="/alerta-empleo">Alerta de Empleo</Link>
          {username && <Link to="/perfil">Perfil</Link>}
          {username && <Link to="/dashboard">Dashboard</Link>}
        </div>

        {username && <span className="user-info">{username}</span>}

        <div className="nav-right">
          <button onClick={toggleTheme}>
            {theme === 'light' ? 'Modo Oscuro 🌙' : 'Modo Claro ☀️'}
          </button>
          {username ? (
            <button onClick={handleLogout} className="logoutButtonApp">
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login">Login</Link>
              <Link to="/register">Registro</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/usuarios" element={<Users isAdmin={isAdmin} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/alerta-empleo" element={<AlertaEmpleo />} />
        <Route
          path="/perfil"
          element={<Perfil handleLogout={handleLogout} handleUsernameUpdate={handleUsernameUpdate} />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </>
  );
}

export default AppContent;
