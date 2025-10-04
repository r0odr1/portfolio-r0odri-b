require('dotenv').config();
const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

app.post('/api/contact', async (req, res) => {
    const { name, email, subject, message } = req.body;

    console.log('📦 BODY RECIBIDO:', req.body);

    if (!name || !email || !subject || !message) {
        return res.status(400).json({
            success: false,
            message: 'Todos los campos son requeridos'
        });
    }

    const mailOptions = {
        from: `"${name}" <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_USER, 
        subject: `📬 Portafolio - ${subject}`,
        html: `
      <h2>Mensaje de ${name}</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>Asunto:</strong> ${subject}</p>
      <p><strong>Mensaje:</strong></p>
      <p>${message}</p>
    `,
        replyTo: email,
    };

    try {
        await transporter.sendMail(mailOptions);
        res.json({
            success: true,
            message: 'Mensaje enviado correctamente'
        });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({
            success: false,
            message: 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
        });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
