require('dotenv').config();
const express = require('express');
const path = require('path');
const { Resend } = require('resend');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// Initialize Resend lazily to prevent crash if API key is missing during build/init
let resend;
const getResend = () => {
  if (!resend) {
    if (!process.env.RESEND_API_KEY) {
      console.error('CRITICAL: RESEND_API_KEY is missing');
      return null;
    }
    resend = new Resend(process.env.RESEND_API_KEY);
  }
  return resend;
};

// API Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', env: process.env.NODE_ENV });
});

// Endpoint to send contact emails
app.post('/api/send-email', async (req, res) => {
  const { name, company, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (nombre, email o mensaje).' });
  }

  const resendClient = getResend();
  if (!resendClient) {
    return res.status(500).json({ error: 'Error de configuración en el servidor (API Key).' });
  }

  try {
    const { data, error } = await resendClient.emails.send({
      from: 'PriSYS Solutions <onboarding@resend.dev>',
      to: [process.env.COMPANY_EMAIL || 'prisys.solutions@gmail.com'],
      subject: `Nuevo mensaje de contacto: ${name}`,
      reply_to: email,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #0a1628; background: #f4f8fc; border-radius: 12px;">
          <h2 style="color: #1e8fd4;">Nuevo Lead de PriSYS Landing</h2>
          <p><strong>Nombre:</strong> ${name}</p>
          <p><strong>Empresa:</strong> ${company || 'No especificada'}</p>
          <p><strong>Email del cliente:</strong> ${email}</p>
          <hr style="border: none; border-top: 1px solid #d0e8f5; margin: 20px 0;">
          <p><strong>Mensaje:</strong></p>
          <p style="white-space: pre-wrap; background: #ffffff; padding: 15px; border-radius: 8px; border: 1px solid #d0e8f5;">${message}</p>
          <footer style="margin-top: 30px; font-size: 12px; color: #5a7a99;">
            Enviado automáticamente desde el formulario de PriSYS Solutions.
          </footer>
        </div>
      `,
    });

    if (error) {
      console.error('Error from Resend:', error);
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Internal server error:', err);
    res.status(500).json({ error: 'Ocurrió un error inesperado al enviar el mensaje.' });
  }
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Catch-all route for any other request (SPA-like or just serving index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
  });
}

module.exports = app;
