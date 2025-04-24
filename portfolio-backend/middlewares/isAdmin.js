// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
    }
    next();
  };
  
  module.exports = isAdmin;
  