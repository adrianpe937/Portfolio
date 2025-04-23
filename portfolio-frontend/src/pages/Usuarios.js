import React, { useEffect, useState } from 'react';

function Users() {
  // Estado para almacenar los usuarios
  const [users, setUsers] = useState([]);

  // Estado para manejar errores
  const [error, setError] = useState(null);

  // Usamos useEffect para hacer la petición al cargar el componente
  useEffect(() => {
    // Realizamos la petición al backend para obtener los usuarios
    fetch('http://localhost:5000/users') // Asegúrate de que la URL sea correcta
      .then(response => response.json()) // Convertimos la respuesta a JSON
      .then(data => setUsers(data)) // Guardamos los usuarios en el estado
      .catch(error => setError(error.message)); // Manejo de errores
  }, []);

  return (
    <div>
      <h2>Usuarios</h2>
      {error && <p>Error: {error}</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>
            <strong>Nombre de usuario:</strong> {user.username} <br />
            <strong>Email:</strong> {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Users;
