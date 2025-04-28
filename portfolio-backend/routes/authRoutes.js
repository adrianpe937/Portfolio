const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getAllUsers } = require('../controllers/authController');
const { updateUserProfile } = require('../controllers/PerfilController');
const authenticateToken = require('../middlewares/AuthenticateToken'); 
const isAdmin = require('../middlewares/isAdmin'); 

// Rutas
router.post('/register', registerUser);
router.post('/login', loginUser);

// 🟢 AÑADIR authenticateToken antes de getAllUsers
router.get('/users', authenticateToken, getAllUsers);

router.put('/update-profile', authenticateToken, updateUserProfile);
router.get('/admin-dashboard', authenticateToken, isAdmin);

module.exports = router;
