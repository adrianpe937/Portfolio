// routes/authRoutes.js
const express = require('express');
const User = require('../models/User'); // Asegúrate de que la ruta sea correcta
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const { updateUserProfile } = require('../controllers/PerfilController');
const authenticateToken = require('../middlewares/AuthenticateToken'); // Importa el middleware
const router = express.Router();

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta para login de un usuario
router.post('/login', loginUser);

// Ruta para obtener todos los usuarios
router.get('/users', getAllUsers);

// Ruta para actualizar el perfil del usuario, con autenticación
router.put('/update-profile', authenticateToken, updateUserProfile); // Añade el middleware aquí

module.exports = router;
