const express = require('express');
require('dotenv').config();
const app = express();
const authRoutes = require('./routes/authRoutes'); // importa tus rutas
const mongoose = require('mongoose');
const cors = require('cors');

app.use(cors()); // para que React pueda hacer peticiones al backend
app.use(express.json());

app.use('/', authRoutes); // monta las rutas
app.get('/', (req, res) => {
  res.send('API funcionando');
});


mongoose.connect('mongodb://localhost:27017/portfolioDB')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((err) => console.error('Error de conexión', err));

app.listen(5000, () => console.log('Servidor backend en http://localhost:5000'));
