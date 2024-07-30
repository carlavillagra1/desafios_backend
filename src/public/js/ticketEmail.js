const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config()
;
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    service: 'gmail',
    port: process.env.SMTP_PORT,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendTicketByEmail(userEmail, subject, text, html) {
    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: userEmail,
        subject: subject,
        text: text,
        html: html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email enviado con éxito');
    } catch (error) {
        console.error('Error al enviar el email:', error);
        throw new Error('Error al enviar el email: ' + error.message);
    }
}

module.exports = { sendTicketByEmail };
