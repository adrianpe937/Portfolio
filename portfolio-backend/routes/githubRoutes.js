const express = require('express');
const router = express.Router();
const authenticateToken = require('../middlewares/AuthenticateToken');
const isAdmin = require('../middlewares/isAdmin');
const githubController = require('../controllers/githubController');

router.get('/', githubController.getAll);
router.post('/', authenticateToken, isAdmin, githubController.add);
router.put('/:id', authenticateToken, isAdmin, githubController.update);
router.delete('/:id', authenticateToken, isAdmin, githubController.delete);

module.exports = router;
