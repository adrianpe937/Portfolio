// controllers/perfilController.js
const User = require('../models/User'); // Importamos el modelo de usuario
const TwitterClient = require('../utils/TwitterClient'); // Importar cliente de Twitter

// Actualizar el perfil del usuario
exports.updateUserProfile = async (req, res) => {
  const { username, email } = req.body;
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

    // Guardamos los cambios en la base de datos
    await user.save();

    // Respondemos con el usuario actualizado
    res.status(200).json({ message: 'Perfil actualizado exitosamente', user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil', error });
  }
};

exports.postToTwitter = async (req, res) => {
  const { repos, userId } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user || !user.twitter) {
      return res.status(404).json({ message: 'Usuario no encontrado o Twitter no configurado' });
    }

    for (const repo of repos) {
      const tweet = `🚀 Nuevo proyecto en GitHub: ${repo.name}\n${repo.html_url}\nDescripción: ${repo.description || 'Sin descripción'}`;
      await TwitterClient.postTweet(tweet); // Publicar en Twitter
    }

    res.status(200).json({ message: 'Publicaciones en Twitter realizadas con éxito' });
  } catch (error) {
    console.error('Error al publicar en Twitter:', error);
    res.status(500).json({ message: 'Error al publicar en Twitter', error });
  }
};
