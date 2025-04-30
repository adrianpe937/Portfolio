import React, { useEffect, useState } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import Chart from 'chart.js/auto';

function Dashboard() {
  const [repoStats, setRepoStats] = useState([]);

  useEffect(() => {
    // Llama a tu backend o API de GitHub
    fetch('/api/github/repos') // O directamente a la API de GitHub si está permitido
      .then(res => res.json())
      .then(data => {
        setRepoStats(data);
      });
  }, []);

  const chartData = {
    labels: repoStats.map(repo => repo.name),
    datasets: [
      {
        label: 'Estrellas',
        data: repoStats.map(repo => repo.stars),
        backgroundColor: 'rgba(75,192,192,0.6)',
      },
    ],
  };

  return (
    <div className="dashboard">
      <h2>Estadísticas del Portfolio</h2>
      <Bar data={chartData} />
    </div>
  );
}

export default Dashboard;
