import React, { useEffect, useState } from 'react';
import '../css/Usuarios.css'; // Asegúrate de importar el archivo CSS

function Users() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:5000/users')
      .then(response => response.json())
      .then(data => setUsers(data))
      .catch(error => setError(error.message));
  }, []);

  return (
    <div className="users-container">
      <h2>Usuarios</h2>
      {error && <p className="error-message">Error: {error}</p>}
      <table className="users-table">
        <thead>
          <tr>
            <th>Nombre de Usuario</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Users;
