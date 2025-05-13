const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/AuthenticateToken');
const {
  getPortfolioData,
  addPortfolioData,
  updatePortfolioData,
  deletePortfolioData,
} = require('../controllers/portfolioController');

// Rutas para el Portfolio
router.get('/', authenticateToken, getPortfolioData);
router.post('/', authenticateToken, addPortfolioData);
router.put('/:id', authenticateToken, updatePortfolioData);
router.delete('/:id', authenticateToken, deletePortfolioData);

module.exports = router;
