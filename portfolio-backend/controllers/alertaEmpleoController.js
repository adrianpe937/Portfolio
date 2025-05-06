const nodemailer = require('nodemailer');

let alertas = []; // Se puede reemplazar con una DB real

exports.crearAlertaEmpleo = (req, res) => {
  const { email, keywords } = req.body;
  if (!email || !keywords) {
    return res.status(400).json({ message: 'Faltan campos obligatorios' });
  }

  alertas.push({ email, keywords });
  res.status(200).json({ message: 'Alerta guardada correctamente' });
};

// Esta función debería llamarse desde un cronjob o proceso cada cierto tiempo
exports.comprobarOfertas = async () => {
  // 🔴 Aquí debes usar scraping de LinkedIn o una API si está disponible
  const nuevasOfertas = [
    { title: 'Desarrollador React', url: 'https://www.linkedin.com/jobs/view/123' }
  ];

  for (const alerta of alertas) {
    const coincidencias = nuevasOfertas.filter(oferta =>
      oferta.title.toLowerCase().includes(alerta.keywords.toLowerCase())
    );

    if (coincidencias.length > 0) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: 'tuapp@gmail.com',
          pass: 'tu-clave-app' // Usar clave de aplicación, no la contraseña real
        }
      });

      await transporter.sendMail({
        from: '"Alerta Empleo" <tuapp@gmail.com>',
        to: alerta.email,
        subject: '¡Nueva oferta encontrada!',
        html: `<p>Se ha encontrado una oferta relacionada con <b>${alerta.keywords}</b>:</p>
               <a href="${coincidencias[0].url}">${coincidencias[0].title}</a>`
      });
    }
  }
};
