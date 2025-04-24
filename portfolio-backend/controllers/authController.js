// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Registrar un nuevo usuario
// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    const newUser = new User({ username, email, password });
    await newUser.save();

    // 🟢 Incluir más datos en el payload del token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    // 🟢 Añadimos isAdmin al payload del token
    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, isAdmin: user.isAdmin }, // Incluimos isAdmin
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};





// Obtener todos los usuarios
// controllers/authController.js
exports.getAllUsers = async (req, res) => {
  if (!req.user.isAdmin) {
    return res.status(403).json({ message: 'No tienes permisos para ver esta página' });
  }

  try {
    const users = await User.find({}, 'username email'); // Solo devolvemos username y email
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener usuarios', error });
  }
};

  