require('dotenv').config(); // Asegúrate de que dotenv se cargue al inicio
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('../models/User');

const hashPasswords = async () => {
  try {
    console.log('MONGO_URI:', process.env.MONGO_URI); // Log para verificar si MONGO_URI está definido

    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI no está definido. Verifica tu archivo .env');
    }

    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const users = await User.find();
    for (const user of users) {
      if (!user.password.startsWith('$2b$')) { // Check if the password is already hashed
        console.log(`Encriptando contraseña para el usuario: ${user.email}`);
        user.password = await bcrypt.hash(user.password, 10);
        await user.save();
        console.log(`Contraseña encriptada para el usuario: ${user.email}`);
      }
    }

    console.log('Todas las contraseñas han sido encriptadas correctamente');
    mongoose.disconnect();
  } catch (error) {
    console.error('Error al encriptar las contraseñas:', error);
  }
};

hashPasswords();
