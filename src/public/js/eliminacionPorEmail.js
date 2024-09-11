const User = require('../../dao/models/user.model.js');
const nodemailer = require('nodemailer');
const logger = require('../../utils/logger.js')


const transporter = nodemailer.createTransport({
    service: 'gmail', 
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
    },
});

// Función para enviar un correo de eliminación de cuenta
async function sendAccountDeletionEmail(to, subject, text, html) {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            text,
            html,
        });
        logger.info(`Correo enviado a ${to}`);
    } catch (error) {
        logger.error(`Error al enviar el correo a ${to}:`, error);
    }
}

// Función para eliminar usuarios inactivos
async function deleteInactiveUsers() {
    const inactivityThreshold = new Date(Date.now() - 2 * 24 * 60 * 60 * 1000); // Inactivos más de 2 días
    const inactiveUsers = await User.find({ last_connection: { $lt: inactivityThreshold } });

    if (inactiveUsers.length === 0) {
        logger.error('No se encontraron usuarios inactivos.');
        return;
    }

    const deletionPromises = inactiveUsers.map(async (user) => {
        const subject = 'Cuenta eliminada por inactividad';
        const text = 'Tu cuenta ha sido eliminada debido a inactividad prolongada.';
        const html = `<p>Tu cuenta ha sido eliminada debido a inactividad prolongada.</p>`;

        // Enviar correo de eliminación
        await sendAccountDeletionEmail(user.email, subject, text, html);

        // Eliminar usuario
        return User.deleteOne({ _id: user._id }); 
    });
    await Promise.all(deletionPromises);
    logger.info(`Se eliminaron ${inactiveUsers.length} usuarios inactivos.`);
    
    return inactiveUsers.length;
}

module.exports = {
    deleteInactiveUsers,
};
