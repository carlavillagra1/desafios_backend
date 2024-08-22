const User = require("../dao/models/user.model.js");
const passport = require("passport");
const logger = require('../utils/logger.js')
const jwt = require('jsonwebtoken');
const { sendTicketByEmail } = require('../public/js/ticketEmail.js');
const UserService = require('../services/userService.js');
const userService = new UserService();
require('dotenv').config(); 


exports.register = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        logger.warning('Intento de registro con datos incompletos', { requestData: req.body });
        return res.status(400).send('Datos incompletos');
    }
    try {
        res.status(200).send({status: "success", message: "usuario registrado"});
        logger.info('Usuario registrado con exito')
    } catch (error) {
        logger.error('Error al registrarse' + error.message)
        res.status(500).send('Error al registrar usuario');
    }
};


exports.failRegister = async (req, res) => {
    logger.info('Estrategia fallida');
    res.send({error: "Fallo"});
};

exports.login = async (req, res) => {
    if (!req.user) {
        logger.warning('Intento de inicio de sesión fallido con datos incompletos', { requestData: req.body });
        return res.status(400).send({ status: "error", error: "Datos incompletos" });
    }
    try {
        // Configurar la sesión del usuario
        req.session.user = {
            id: req.user._id,
            nombre: req.user.nombre,
            apellido: req.user.apellido,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        // Enviar respuesta según el rol del usuario
        if (req.user.role === 'admin') {
            return res.status(200).send({ status: "success", message: "Inicio de sesión exitoso", redirect: '/api/views/realtimeProducts' });
        } else {
            return res.status(200).send({ status: "success", message: "Inicio de sesión exitoso", redirect: '/api/views/home' });
        }
    } catch (error) {
        logger.error('Error al iniciar sesión: ' + error.message);
        res.status(500).send({ status: "error", message: 'Error al iniciar sesión' });
    }
};


exports.failLogin = async (req, res) => {
    logger.error('Login fallido');
    res.send({error: "Login fallido"});
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        return res.status(200).send({ status: "success", message: "Sesión cerrada exitosamente", redirect: '/api/views/login' });
    });
};
exports.requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            logger.warning('Intento de restablecimiento para usuario no encontrado', { email });
            return res.status(404).send('Usuario no encontrado');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `http://localhost:8080/api/views/restablecerPass?token=${encodeURIComponent(token)}`;        
        const html = `<p>Haz clic en <a href="${resetLink}">este enlace</a> para restablecer tu contraseña. Este enlace expirará en 1 hora.</p>`;
        await sendTicketByEmail(email, 'Restablecimiento de contraseña', '', html);
        res.status(200).send('Correo de restablecimiento de contraseña enviado');
    } catch (error) {
        logger.error('Error al enviar el correo de restablecimiento de contraseña: ' + error.message);
        res.status(500).send('Error al enviar el correo de restablecimiento de contraseña');
    }
};
exports.resetPassword = async (req, res) => {
    const { token, 'new-password': newPassword } = req.body;
    // Se asegúra de que el token esté limpio y sin espacios adicionales
    const cleanToken = token.trim();
    try {
        // Verifica el token limpio
        const decoded = jwt.verify(cleanToken, process.env.JWT_SECRET);
        const user = await userService.getUserById(decoded.id);
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        const isSamePassword = await user.comparePassword(newPassword);
        if (isSamePassword) {
            return res.status(400).send('La nueva contraseña no puede ser la misma que la anterior');
        }
        await userService.updateUserPassword(user._id, newPassword);
        res.send('Contraseña restablecida exitosamente');
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(400).send('El enlace ha expirado. Solicita un nuevo enlace para restablecer la contraseña.');
        }
        logger.error('Error al restablecer la contraseña: ' + error.message);
        res.status(500).send('Error al restablecer la contraseña');
    }
};

exports.resendResetLink = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userService.getUserByEmail(email);
        if (!user) {
            logger.warning('Intento de reenviar enlace para usuario no encontrado', { email });
            return res.status(404).send('Usuario no encontrado');
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        const resetLink = `http://localhost:8080/api/views/restablecerPass?token=${encodeURIComponent(token)}`;
        const html = `<p>Haz clic en <a href="${resetLink}">este enlace</a> para restablecer tu contraseña. Este enlace expirará en 1 hora.</p>`;
        await sendTicketByEmail(email, 'Restablecimiento de contraseña', '', html);
        res.send('Correo de restablecimiento de contraseña reenviado');
    } catch (error) {
        logger.error('Error al reenviar el correo de restablecimiento de contraseña: ' + error.message);
        res.status(500).send('Error al reenviar el correo de restablecimiento de contraseña');
    }
};


exports.changePassword = async (req, res) => {
    const { email, 'current-password': currentPassword, 'new-password': newPassword } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warning('Intento de cambio de contraseña para usuario no encontrado', { email });
            return res.status(404).send('Usuario no encontrado');
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            logger.warning('Intento de cambio de contraseña con contraseña actual incorrecta', { email });
            return res.status(400).send('Contraseña actual incorrecta');
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Contraseña cambiada exitosamente' });
    } catch (error) {
        logger.error('Error al actualizar la contraseña' + error.message)
        res.status(500).send('Error al actualizar la contraseña');
    }
};

exports.github = passport.authenticate('github', {scope: 'user.email'});

exports.githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/views/home');
};


exports.changeRoles = async(req, res) =>{
    try {
        const { uid } = req.params;
        const user = await userService.getUserById(uid);
        
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        user.role = user.role === 'user' ? 'premium' : 'user';
        await userService.updateUser(user);

        res.status(200).json({ message: `Rol de usuario actualizado a ${user.role}` });
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar el rol del usuario: ' + error.message });
    }
}