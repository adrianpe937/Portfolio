const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/authMiddleware');
const { updateUserProfile, postToTwitter } = require('../controllers/PerfilController');

// Ruta para actualizar el perfil del usuario
router.put('/update-profile', authenticateToken, updateUserProfile);

// Ruta para programar una publicación en Twitter
router.post('/post-twitter', authenticateToken, postToTwitter);

module.exports = router;