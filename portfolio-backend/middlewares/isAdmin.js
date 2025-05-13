const isAdmin = (req, res, next) => {
  console.log('Admin Check:', req.user); // Add this to debug
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
  }
  next();
};

module.exports = isAdmin;
