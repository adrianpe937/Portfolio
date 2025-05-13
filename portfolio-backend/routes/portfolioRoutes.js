const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/AuthenticateToken');
const isAdmin = require('../middlewares/isAdmin');
const {
  getPortfolioData,
  addPortfolioData,
  updatePortfolioData,
  deletePortfolioData,
} = require('../controllers/portfolioController');

// Rutas para el Portfolio
router.get('/', authenticateToken, isAdmin, getPortfolioData); // Protegida con authenticateToken y isAdmin
router.post('/', authenticateToken, isAdmin, addPortfolioData);
router.put('/:id', authenticateToken, isAdmin, updatePortfolioData);
router.delete('/:id', authenticateToken, isAdmin, deletePortfolioData);

module.exports = router;
