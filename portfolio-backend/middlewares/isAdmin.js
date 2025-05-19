module.exports = function (req, res, next) {
  console.log('Middleware isAdmin - req.user:', req.user);
  if (req.user && req.user.isAdmin) {
    return next();
  }
  return res.status(403).json({ message: 'Acceso denegado: Solo administradores' });
};