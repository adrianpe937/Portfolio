// middleware/authenticateToken.js
const jwt = require('jsonwebtoken');

// Middleware para verificar el JWT
const authenticateToken = (req, res, next) => {
  // Obtenemos el token desde el encabezado Authorization
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  // Verificamos el token usando el secreto JWT
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Invalid token' });
    }

    // Si el token es válido, asignamos los datos del usuario a req.user
    req.user = decoded;
    next(); // Pasamos al siguiente middleware o controlador
  });
};

module.exports = authenticateToken;
