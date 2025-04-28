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

    const newUser = new User({ username, email, password, isAdmin: false });
    await newUser.save();

    // 🟢 Incluir más datos en el payload del token
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, email: newUser.email, isAdmin: user.isAdmin },
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

exports.getAllUsers = async (req, res) => {
  try {
    // Asegúrate de que req.user tiene el campo 'isAdmin'
    if (!req.user || typeof req.user.isAdmin === 'undefined') {
      return res.status(403).json({ message: 'Acceso denegado: No tienes privilegios' });
    }

    // Obtener todos los usuarios desde la base de datos
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(500).json({ message: "No se encontraron usuarios" });
    }

    res.status(200).json(users); // Responde con la lista de usuarios
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};




  