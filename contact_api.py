from flask import Flask, request, jsonify
from flask_mail import Mail, Message
from flask_cors import CORS
import os
from dotenv import load_dotenv
import traceback  # <-- Importa traceback aquí

# Cargar variables del .env automáticamente
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configuración de Flask-Mail
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config['MAIL_USERNAME'] = os.environ.get('GMAIL_USER')
app.config['MAIL_PASSWORD'] = os.environ.get('GMAIL_APP_PASSWORD')
app.config['MAIL_DEFAULT_SENDER'] = os.environ.get('GMAIL_USER')

print("GMAIL_USER:", os.environ.get('GMAIL_USER'))

mail = Mail(app)

#Recibe los datos del formulario y lo envía usando Flask-Mail.
@app.route('/api/contacto', methods=['POST'])
def contacto():
    data = request.get_json()
    nombre = data.get('nombre')
    email = data.get('email')
    mensaje = data.get('mensaje')

    if not nombre or not email or not mensaje:
        return jsonify({'message': 'Faltan campos obligatorios'}), 400

    try:
        msg = Message(
            subject='Nuevo mensaje de contacto desde el portfolio',
            sender=os.environ.get('GMAIL_USER'),  # <-- Añade esto
            recipients=[os.environ.get('GMAIL_USER')],
            html=f"""
                <h3>Nuevo mensaje de contacto</h3>
                <p><b>Nombre:</b> {nombre}</p>
                <p><b>Email:</b> {email}</p>
                <p><b>Mensaje:</b><br/>{mensaje}</p>
            """
        )
        mail.send(msg)
        return jsonify({'message': 'Mensaje enviado correctamente'}), 200
    except Exception as e:
        print("ERROR AL ENVIAR CORREO:", e)
        traceback.print_exc()  # <-- Esto imprime el error completo
        return jsonify({'message': 'Error al enviar el mensaje', 'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=8000, debug=True)
