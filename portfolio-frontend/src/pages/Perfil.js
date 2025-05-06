import React, { useEffect, useState } from 'react';
import { jwtDecode } from 'jwt-decode';
import { useNavigate } from 'react-router-dom'; 
import '../css/Perfil.css';

function Perfil({ handleUsernameUpdate, handleLogout }) {
  const [user, setUser] = useState(null);
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({ username: '', email: '', twitter: '', linkedin: '' });
  const [mensaje, setMensaje] = useState('');
  const [red, setRed] = useState('twitter');
  const [fecha, setFecha] = useState('');
  const navigate = useNavigate(); // Hook para la redirección

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);

      const fetchUserData = async () => {
        try {
          const response = await fetch('http://localhost:5000/get-user', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });

          if (response.ok) {
            const data = await response.json();
            setUser(data.user);
            setUserData({
              username: data.user.username,
              email: data.user.email,
              twitter: data.user.twitter || '',
              linkedin: data.user.linkedin || '',
            });

            // Obtener los repositorios de GitHub
            if (data.user.username) {
              try {
                const reposResponse = await fetch(`https://api.github.com/users/${data.user.username}/repos?sort=updated&per_page=6`);
                const reposData = await reposResponse.json();

                if (Array.isArray(reposData)) {
                  setRepos(reposData);
                  setError(null);
                } else {
                  setRepos([]);
                  setError('No hay repositorios disponibles.');
                }
              } catch (reposError) {
                console.error('Error al obtener los repositorios:', reposError);
                setError('Error al obtener los repositorios.');
                setRepos([]);
              }
            }
          } else {
            console.error('Error al obtener los datos del usuario:', response.statusText);
            navigate('/login'); // Redirige a login si hay un error
          }
        } catch (error) {
          console.error('Error al obtener los datos del usuario:', error);
          navigate('/login'); // Redirige a login si hay un error
        } finally {
          setLoading(false); // Asegurarse de que el estado de carga se actualice
        }
      };

      fetchUserData();
    } else {
      navigate('/login'); // Redirige a login si no hay token
    }
  }, [navigate]);

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
          twitter: userData.twitter,
          linkedin: userData.linkedin
        }),
      });

      const data = await response.json();
      
      if (response.ok) {
        // Actualizar el estado del usuario con los datos devueltos por el backend
        setUser(data.user);
        setUserData({
          username: data.user.username,
          email: data.user.email,
          twitter: data.user.twitter || '',
          linkedin: data.user.linkedin || ''
        });
        setIsEditing(false);
        alert('Perfil actualizado correctamente');
        handleUsernameUpdate(data.user.username);
      } else {
        alert(data.message || 'Error al actualizar el perfil');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al actualizar el perfil');
    }
  };

  const handlePostSchedule = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('No estás autenticado');
      return;
    }

    const postData = {
      mensaje,
      red,
      fechaProgramada: fecha,
      userId: user.id
    };

    try {
      const response = await fetch('http://localhost:5000/programar-publicacion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(postData),
      });

      const data = await response.json();

      if (response.ok) {
        alert('Publicación programada correctamente');
        setMensaje('');
        setFecha('');
      } else {
        alert(data.message || 'Error al programar la publicación');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al programar la publicación');
    }
  };

  const handleLogoutAndRedirect = () => {
    handleLogout(); // Esto limpia el estado en App
    navigate('/login'); // Redirige a la página de login
  };

  return (
    <div className="container">
      <div className="innerWrapper">
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
                      onChange={e => setUserData({ ...userData, username: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="email">Correo Electrónico</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={userData.email}
                      onChange={e => setUserData({ ...userData, email: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="twitter">Twitter</label>
                    <input
                      type="text"
                      id="twitter"
                      name="twitter"
                      value={userData.twitter}
                      onChange={e => setUserData({ ...userData, twitter: e.target.value })}
                    />
                  </div>
                  <div>
                    <label htmlFor="linkedin">LinkedIn</label>
                    <input
                      type="text"
                      id="linkedin"
                      name="linkedin"
                      value={userData.linkedin}
                      onChange={e => setUserData({ ...userData, linkedin: e.target.value })}
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
                    </tr>
                    <tr>
                      <td>Twitter</td>
                      <td>{user.twitter || 'No proporcionado'}</td>
                    </tr>
                    <tr>
                      <td>LinkedIn</td>
                      <td>{user.linkedin || 'No proporcionado'}</td>
                    </tr>
                    <tr>
                      <td>Rol</td>
                      <td>{user.isAdmin ? 'Administrador' : 'Usuario Regular'}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </>
          ) : (
            <p className="loadingText">Cargando datos del usuario...</p>
          )}

          {!isEditing && (
            <button onClick={handleLogoutAndRedirect} className="logoutButton">
              Cerrar sesión
            </button>
          )}

          <button onClick={() => setIsEditing(!isEditing)} className="editButton">
            {isEditing ? 'Cancelar' : 'Editar Perfil'}
          </button>
        </div>

        {/* Sección para programar publicaciones */}
        <div>
          <h3 className="heading">📢 Programar Publicaciones</h3>
          <form onSubmit={e => e.preventDefault()}>
            <div>
              <textarea 
                value={mensaje} 
                onChange={e => setMensaje(e.target.value)} 
                placeholder="Escribe tu mensaje para publicar..."
              />
            </div>
            <div>
              <select value={red} onChange={e => setRed(e.target.value)}>
                <option value="twitter">Twitter</option>
                <option value="linkedin">LinkedIn</option>
              </select>
            </div>
            <div>
              <input 
                type="datetime-local" 
                value={fecha} 
                onChange={e => setFecha(e.target.value)} 
              />
            </div>
            <button onClick={handlePostSchedule} className="scheduleButton">Programar Publicación</button>
          </form>
        </div>
         {/* Mostrar repositorios de GitHub */}
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
