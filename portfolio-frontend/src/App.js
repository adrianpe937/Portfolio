import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Usuarios from './pages/Usuarios';
import Perfil from './pages/Perfil';



function App() {
  return (
    <Router>
      <nav>
        <Link to="/register">Registro</Link> | 
        <Link to="/login">Login</Link> | 
        <Link to="/usuarios">Usuarios</Link>
      </nav>

      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usuarios" element={<Usuarios />} />
        <Route path="/perfil" element={<Perfil />} />
      </Routes>
    </Router>
  );
}

export default App;
