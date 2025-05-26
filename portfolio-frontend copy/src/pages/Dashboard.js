import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Dashboard() {
  const [portfolioData, setPortfolioData] = useState([]);
  const [formData, setFormData] = useState({ section: '', content: {} });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetch('/api/portfolio', { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
      .then(res => res.json())
      .then(data => setPortfolioData(data));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAdd = () => {
    fetch('/api/portfolio', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(formData),
    }).then(() => window.location.reload());
  };

  const handleEdit = (id, section, content) => {
    setEditingId(id);
    setFormData({ section, content });
  };

  const handleUpdate = () => {
    fetch(`/api/portfolio/${editingId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
      body: JSON.stringify(formData),
    }).then(() => {
      setEditingId(null);
      window.location.reload();
    });
  };

  const handleDelete = (id) => {
    fetch(`/api/portfolio/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    }).then(() => window.location.reload());
  };

  return (
    <div className="dashboard">
      <h2>Gestión del Portfolio</h2>
      <div>
        <input
          name="section"
          placeholder="Sección"
          value={formData.section}
          onChange={handleInputChange}
        />
        <textarea
          name="content"
          placeholder="Contenido"
          value={formData.content}
          onChange={handleInputChange}
        ></textarea>
        {editingId ? (
          <button onClick={handleUpdate}>Actualizar</button>
        ) : (
          <button onClick={handleAdd}>Agregar</button>
        )}
      </div>
      <ul>
        {portfolioData.map(item => (
          <li key={item._id}>
            <strong>{item.section}</strong>: {JSON.stringify(item.content)}
            <button onClick={() => handleEdit(item._id, item.section, item.content)}>Editar</button>
            <button onClick={() => handleDelete(item._id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
