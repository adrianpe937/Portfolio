const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./portfolio-backend/models/User'); // Ajusta la ruta según tu proyecto
require('dotenv').config({ path: './portfolio-backend/.env' }); // Cargar variables de entorno desde .env

console.log('MONGO_URI desde .env:', process.env.MONGO_URI); // Log para depurar

const updatePassword = async (email, newPassword) => {
  try {
    // Conexión a MongoDB usando la URI del archivo .env
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 60000, // Aumenta el tiempo de espera a 60 segundos
      socketTimeoutMS: 60000, // Aumenta el tiempo de espera para las operaciones
    });

    console.log('Conexión exitosa a MongoDB');

    // Encriptar la nueva contraseña
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Actualizar la contraseña del usuario
    const user = await User.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    );

    if (user) {
      console.log('Contraseña actualizada correctamente:', user);
    } else {
      console.log('Usuario no encontrado');
    }

    // Cerrar la conexión
    mongoose.connection.close();
  } catch (error) {
    console.error('Error al actualizar la contraseña:', error);
    mongoose.connection.close();
  }
};

updatePassword('nuevo@gmail.com', '123456'); // Reemplaza con el email y la nueva contraseña