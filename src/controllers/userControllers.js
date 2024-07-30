const User = require("../dao/models/user.model.js");
const passport = require("passport");
const logger = require('../utils/logger.js')

exports.register = async (req, res) => {
    if (!req.body.email || !req.body.password) {
        logger.warning('Intento de registro con datos incompletos', { requestData: req.body });
        return res.status(400).send('Datos incompletos');
    }
    try {
        res.send({status: "success", message: "usuario registrado"});
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
        return res.status(400).send({status: "error", error: "Datos incompletos"});
    }
    try {
        req.session.user = {
            id: req.user._id,
            nombre: req.user.nombre,
            apellido: req.user.apellido,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        if (req.user.role === 'admin') {
            return res.redirect('/api/views/realtimeProducts');
        } else {
            return res.redirect('/api/views/home');
        }
    } catch (error) {
        logger.error('Error al iniciar sesion' + error.message)
        res.status(500).send('Error al iniciar sesión');
    }
};

exports.failLogin = async (req, res) => {
    logger.error('Login fallido');
    res.send({error: "Login fallido"});
};

exports.logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/api/views/login');
    });
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
        res.send('Contraseña actualizada exitosamente');
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
