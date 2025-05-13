// controllers/perfilController.js
const User = require('../models/User'); // Importamos el modelo de usuario

// Actualizar el perfil del usuario
exports.updateUserProfile = async (req, res) => {
  const { username, email, twitter, linkedin } = req.body;
  const userId = req.user.id; // Esto asume que tienes un token JWT que ya ha decodificado el id del usuario.
  console.log('Usuario autenticado:', req.user);

  try {
    // Encontramos el usuario por su ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    // Actualizamos el usuario
    user.username = username || user.username;
    user.email = email || user.email;
    user.twitter = twitter || user.twitter;
    user.linkedin = linkedin || user.linkedin;

    // Guardamos los cambios en la base de datos
    await user.save();

    // Respondemos con el usuario actualizado
    res.status(200).json({ message: 'Perfil actualizado exitosamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil', error });
  }
};

// Obtener el perfil del usuario autenticado
exports.getUserProfile = async (req, res) => {
  const userId = req.user.id;

  try {
    const user = await User.findById(userId).select('-password'); // Excluir la contraseña de la respuesta

    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }

    res.status(200).json({ user });
  } catch (error) {
    console.error('Error al obtener el perfil del usuario:', error);
    res.status(500).json({ message: 'Error al obtener el perfil del usuario', error });
  }
};
