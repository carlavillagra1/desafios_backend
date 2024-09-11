const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
const logger = require('../../utils/logger.js')
dotenv.config();

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: 'gmail',
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
});

// Función para enviar correo de eliminación de producto para usuarios premium
async function sendProductDeletionEmail(ownerEmail, ownerName, productId) {
    const subject = 'Notificación de Eliminación de Producto';
    const text = `Estimado ${ownerName},\n\nEl producto con ID ${productId} ha sido eliminado de su inventario.\n\nGracias,\nEl equipo`;
    const html = `<p>Estimado ${ownerName},</p><p>El producto con ID ${productId} ha sido eliminado de su inventario.</p><p>Gracias,<br>El equipo</p>`;

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: ownerEmail,
        subject: subject,
        text: text,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        logger.info('Correo electrónico avisando al propitario del producto enviado con éxito');
    } catch (error) {
        logger.error('Error al enviar el correo electrónico:', error);
        throw new Error(`Error al enviar el correo: ${error.message}`);
    }
}

module.exports = {
    sendProductDeletionEmail
};
