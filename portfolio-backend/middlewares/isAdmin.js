const isAdmin = (req, res, next) => {
  if (!req.user || req.user.isAdmin !== true) {
    return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
  }
  next();
};

module.exports = isAdmin;
