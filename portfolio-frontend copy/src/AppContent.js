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
  const navigate = useNavigate();
  const [theme, toggleTheme] = useDarkMode();
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token'); // Obtén el token del localStorage
    if (token) {
      try {
        const decoded = jwtDecode(token); // Decodifica el token correctamente
        console.log('Token decodificado:', decoded); // Log para depurar
        setUsername(decoded.username); // Actualiza el estado del nombre de usuario
        setIsAdmin(decoded.isAdmin); // Actualiza el estado de administrador
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        setUsername('');
        setIsAdmin(false);
      }
    }
  }, []); // Este efecto se ejecuta solo una vez al montar el componente

  const handleLogout = () => {
    localStorage.removeItem('token'); // Elimina el token del localStorage
    setUsername(''); // Limpia el estado del nombre de usuario
    setIsAdmin(false); // Limpia el estado de administrador
    navigate('/login'); // Redirige al login
  };

  const handleUsernameUpdate = (newUsername) => {
    setUsername(newUsername); // Actualiza el estado del nombre de usuario
  };

  // Cierra el menú al navegar
  const handleNavClick = () => setMenuOpen(false);

  // Cierra el menú al cambiar de tamaño a desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 900) setMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <nav className={menuOpen ? "nav-open" : ""}>
        <div className="nav-mobile-header">
          <span className="nav-logo">Portfolio</span>
          <button
            className="nav-hamburger"
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(open => !open)}
          >
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
            <span className="hamburger-bar"></span>
          </button>
        </div>
        <div className={`nav-links${menuOpen ? " nav-links-open" : ""}`}>
          {/* Enlaces internos a secciones del portfolio */}
          <a href="/portfolio#about" className="nav-link" onClick={handleNavClick}>Acerca de mí</a>
          <a href="/portfolio#experience" className="nav-link" onClick={handleNavClick}>Mi experiencia</a>
          <a href="/portfolio#projects" className="nav-link" onClick={handleNavClick}>Proyectos Destacados</a>
          <a href="/portfolio#contact" className="nav-link" onClick={handleNavClick}>Contacto</a>
          {/* Enlaces de navegación generales */}
          {/*
          {!username && <Link to="/register" onClick={handleNavClick}>Registro</Link>}
          */}
          {!username && <Link to="/login" onClick={handleNavClick}>Login</Link>}

          {/*
          {isAdmin && <Link to="/usuarios" onClick={handleNavClick}>Usuarios</Link>}
          <Link to="/portfolio" onClick={handleNavClick}>Portfolio</Link>
          {username && <Link to="/perfil" onClick={handleNavClick}>Perfil</Link>}
          */}
        </div>
        <div className="nav-right">
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙' : '☀️'}
          </button>
          {username ? (
            <button onClick={handleLogout} className="logoutButtonApp">
              Cerrar sesión
            </button>
          ) : (
            <>
              <Link to="/login" onClick={handleNavClick}>Login</Link>
              {/*
              <Link to="/register" onClick={handleNavClick}>Registro</Link>
              */}
            </>
          )}
        </div>
        {username && <span className="user-info">Bienvenido, {username}</span>} {/* Muestra el nombre del usuario */}
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login setUsername={setUsername} />} />
        <Route path="/usuarios" element={<Users isAdmin={isAdmin} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        {/* <Route path="/alerta-empleo" element={<AlertaEmpleo />} /> */}
        <Route
          path="/perfil"
          element={<Perfil handleLogout={handleLogout} handleUsernameUpdate={handleUsernameUpdate} />}
        />
        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
      </Routes>
    </>
  );
}

export default AppContent;
