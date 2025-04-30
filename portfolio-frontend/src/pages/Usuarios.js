import React, { useEffect, useState } from 'react';
import '../css/Usuarios.css'; 
import { useNavigate } from 'react-router-dom';

function Users({ isAdmin }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); // nuevo estado de loading
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token) {
  
        fetch('http://localhost:5000/users', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(response => {
            if (!response.ok) {
              throw new Error('Error al obtener usuarios');
            }
            return response.json();
          })
          .then(data => {
            setUsers(data);
            setLoading(false);
          })
          .catch(error => {
            setError(error.message);
            setLoading(false);
          });
      
    } else {
      navigate('/login');
    }
  }, [isAdmin, navigate]);
  
  if (loading) {
    return <div>Cargando usuarios...</div>; // opcional, pantalla de carga
  }

  return (
    <div className="users-container">
      <h2>Usuarios</h2>
      {error && <p className="error-message">Error: {error}</p>}
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
            <th>rol</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.isAdmin ? 'Administrador' : 'Usuario Regular'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
