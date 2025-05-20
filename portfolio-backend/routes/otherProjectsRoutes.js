const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/AuthenticateToken');
const isAdmin = require('../middlewares/isAdmin');
const {
  getOtherProjects,
  addOtherProject,
  updateOtherProject,
  deleteOtherProject,
} = require('../controllers/otherProjectsController');

// Rutas para otros proyectos
router.get('/', getOtherProjects); // pública
router.post('/', authenticateToken, isAdmin, addOtherProject);
router.put('/:id', authenticateToken, isAdmin, updateOtherProject);
router.delete('/:id', authenticateToken, isAdmin, deleteOtherProject);

module.exports = router;
