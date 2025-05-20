const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const otherProjectsRoutes = require('./routes/otherProjectsRoutes');
const githubRoutes = require('./routes/githubRoutes');

const app = express();

// ✅ Configuración CORS segura
const allowedOrigins = ['http://localhost:3000'];

app.use(cors({
  origin: function (origin, callback) {
    // Permitir también herramientas como Postman (sin origin)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));

// ✅ Middlewares esenciales
app.use(express.json({ limit: '20mb' }));
app.use(express.urlencoded({ limit: '20mb', extended: true }));

// ✅ Ruta de prueba
app.get('/test', (req, res) => {
  res.send('Servidor funciona correctamente ✔️');
});

// ✅ Rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/portfolio', portfolioRoutes);
app.use('/api/otherprojects', otherProjectsRoutes);
app.use('/api/github', githubRoutes);

// ✅ Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a la base de datos "portfolio" en MongoDB Atlas'))
.catch((err) => {
  console.error('❌ Error de conexión a MongoDB Atlas:', err);
  process.exit(1); // Exit the process if the connection fails
});

// ✅ Arrancar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en http://localhost:${PORT}`);
});
