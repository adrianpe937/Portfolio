const jwt = require('jsonwebtoken');
const User = require('../models/User');
const bcrypt = require('bcrypt'); // Ensure bcrypt is imported

// Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log('Datos recibidos:', { username, email, password });

    const userExists = await User.findOne({ email });
    if (userExists) {
      console.log('Usuario ya existe:', email);
      return res.status(400).json({ message: 'Usuario ya existe' });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('Contraseña encriptada:', hashedPassword);

    const newUser = new User({ username, email, password: hashedPassword, isAdmin: false });
    const savedUser = await newUser.save();
    console.log('Usuario guardado en la base de datos:', savedUser);

    const token = jwt.sign(
      { id: savedUser._id, username: savedUser.username, email: savedUser.email, isAdmin: savedUser.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(201).json({ message: 'Usuario creado exitosamente', token });
  } catch (error) {
    console.error('Error al registrar el usuario:', error);
    res.status(500).json({ message: 'Error al registrar el usuario', error });
  }
};

// Login de usuario
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log('Datos recibidos para login:', { email, password }); // Log para depurar

    if (!email || !password) {
      console.log('Faltan campos obligatorios'); // Log para depurar
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      console.log('Usuario no encontrado:', email); // Log para depurar
      return res.status(400).json({ message: 'Usuario no encontrado' });
    }

    console.log('Usuario encontrado:', user); // Log para depurar

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Contraseña ingresada:', password); // Log para depurar la contraseña ingresada
    console.log('Contraseña almacenada (encriptada):', user.password); // Log para depurar la contraseña almacenada
    console.log('¿Contraseña coincide?:', isMatch); // Log para depurar si coinciden

    if (!isMatch) {
    }

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    if (!req.user || typeof req.user.isAdmin === 'undefined') {
      return res.status(403).json({ message: 'Acceso denegado: No tienes privilegios' });
    }

    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(500).json({ message: 'No se encontraron usuarios' });
    }

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los usuarios', error });
  }
};





