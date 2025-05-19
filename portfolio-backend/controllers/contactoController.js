const nodemailer = require('nodemailer');

exports.enviarContacto = async (req, res) => {
  const { nombre, email, mensaje } = req.body;
  if (!nombre || !email || !mensaje) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  try {
    // Configura tu transporte SMTP (ajusta usuario y pass)
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'adrian.pena@inslapineda.cat',
        pass: process.env.GMAIL_APP_PASSWORD // Usa una app password, no tu contraseña real
      }
    });

    await transporter.sendMail({
      from: `"Portfolio Contacto" <${email}>`,
      to: 'adrian.pena@inslapineda.cat',
      subject: 'Nuevo mensaje de contacto desde el portfolio',
      html: `
        <h3>Nuevo mensaje de contacto</h3>
        <p><b>Nombre:</b> ${nombre}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Mensaje:</b><br/>${mensaje}</p>
      `
    });

    res.status(200).json({ message: 'Mensaje enviado correctamente' });
  } catch (err) {
    // Log detallado para depuración
    console.error('Error al enviar el correo de contacto:', err);
    res.status(500).json({ message: 'Error al enviar el mensaje', error: err.message });
  }
};
