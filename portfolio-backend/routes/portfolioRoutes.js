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
router.get('/', getPortfolioData); // <-- Pública, sin authenticateToken
router.post('/', authenticateToken, isAdmin, addPortfolioData);
router.put('/:id', authenticateToken, updatePortfolioData); // <--- quita isAdmin
router.delete('/:id', authenticateToken, deletePortfolioData); // <--- quita isAdmin

module.exports = router;
