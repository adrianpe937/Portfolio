import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom';
import '../css/Perfil.css';  // Asegúrate de importar el archivo CSS

function Perfil() {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ username: '', email: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setUser(decoded);
      setUserData({ username: decoded.username, email: decoded.email }); // Inicializa los datos del usuario
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (userData.username) {
      setLoading(true);
      fetch(`https://api.github.com/users/${userData.username}/repos?sort=updated&per_page=6`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            setRepos(data);
            setError(null);
          } else {
            setRepos([]);
            setError('No hay repositorios disponibles.');
          }
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [userData.username]);
  

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleEditClick = () => {
    setIsEditing(!isEditing); // Cambia el modo de edición
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: userData.username,
          email: userData.email,
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Si la actualización es exitosa, actualizamos el estado del usuario
        setUser((prevUser) => ({
          ...prevUser,
          username: userData.username,
          email: userData.email,
        }));
        setIsEditing(false);
        alert('Perfil actualizado correctamente');
      } else {
        alert(data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el perfil');
    }
  };

  return (
    <div className="container">
      <div className="innerWrapper">
        {/* Tabla de Perfil */}
        <div className="card">
          <h2 className="heading">👤 Perfil del Usuario</h2>
          {user ? (
            <>
              {isEditing ? (
                <form onSubmit={e => e.preventDefault()}>
                  <div>
                    <label htmlFor="username">Nombre de Usuario</label>
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={userData.username}
                      onChange={handleChange}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={handleChange}
                    />
                  </div>
                  <button onClick={handleSave} className="saveButton">Guardar cambios</button>
                </form>
              ) : (
                <table className="profileTable">
                  <tbody>
                    <tr>
                      <th>Campo</th>
                      <th>Valor</th>
                    </tr>
                    <tr>
                      <td>Nombre</td>
                      <td>{user.username}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{user.email}</td>
                    </tr>
                    <tr>
                      <td>ID</td>
                      <td>{user.id}</td>
                    </tr>
                    <tr>
                      <td>GitHub</td>
                      <td>{user.username}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <p className="loadingText">Cargando datos del usuario...</p>
          )}

          {!isEditing && (
            <button
              onClick={handleLogout}
              className="logoutButton"
            >
              Cerrar sesión
            </button>
          )}

          <button
            onClick={handleEditClick}
            className="editButton"
          >
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {/* Repositorios GitHub */}
        <div>
          <h3 className="reposHeading">📁 Repositorios públicos en GitHub</h3>
          {loading ? (
            <div className="spinner"></div>
          ) : error ? (
            <p className="errorText">{error}</p>
          ) : repos.length > 0 ? (
            <div className="reposGrid">
              {repos.map(repo => (
                <div key={repo.id} className="repoCard">
                  <h4 className="repoTitle">
                    <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                      {repo.name}
                    </a>
                  </h4>
                  <p className="repoDesc">
                    {repo.description || 'Sin descripción'}
                  </p>
                  <div className="repoStats">
                    <span>⭐ {repo.stargazers_count}</span>
                    <span>👁️ {repo.watchers_count}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="noReposText">Este usuario no tiene repositorios públicos.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Perfil;
