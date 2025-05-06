const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const { updateUserProfile, getUserProfile } = require('../controllers/PerfilController');
const authenticateToken = require('../middlewares/AuthenticateToken'); 
const isAdmin = require('../middlewares/isAdmin'); 
const { crearAlertaEmpleo } = require('../controllers/alertaEmpleoController');
// Rutas
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🟢 AÑADIR authenticateToken antes de getAllUsers
router.get('/users', authenticateToken, getAllUsers);

router.put('/update-profile', authenticateToken, updateUserProfile);
router.get('/admin-dashboard', authenticateToken, isAdmin);

router.get('/get-user', authenticateToken, getUserProfile);

router.post('/alerta-empleo', authenticateToken, crearAlertaEmpleo);

module.exports = router;
