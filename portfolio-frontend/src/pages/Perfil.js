import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../css/Perfil.css'; // CSS personalizado

function Perfil() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (user?.username) {
      fetch(`https://api.github.com/users/${user.username}/repos?sort=updated&per_page=10`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRepos(data);
          } else {
            setError('No se pudieron obtener los repositorios.');
          }
        })
        .catch(err => setError(err.message));
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="perfil-container">
      <div className="perfil-box">
        <h2>Perfil del usuario</h2>
        {user ? (
          <>
            <p><strong>Usuario:</strong> {user.username}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>ID:</strong> {user.id}</p>
            <button onClick={handleLogout}>Cerrar sesión</button>

            <h3 style={{ marginTop: '2rem' }}>Repositorios públicos de GitHub</h3>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul className="repos-list">
              {repos.map(repo => (
                <li key={repo.id} className="repo-item">
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                    {repo.name}
                  </a> - ⭐ {repo.stargazers_count}
                  <br />
                  <span>{repo.description || 'Sin descripción'}</span>
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Cargando datos del usuario...</p>
        )}
      </div>
    </div>
  );
}

export default Perfil;
