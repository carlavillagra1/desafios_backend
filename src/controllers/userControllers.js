const User = require("../dao/models/user.model.js");
const passport = require("passport");
const logger = require('../utils/logger.js')
const jwt = require('jsonwebtoken');
const { sendTicketByEmail } = require('../public/js/ticketEmail.js');
const UserService = require('../services/userService.js');
const userService = new UserService();
const UserDTO = require('../dao/dto/userDTO.js')
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
        // Actualizar "last_connection" al momento del login
        req.user.last_connection = new Date();
        await req.user.save();

        // Verificar si la actualización de `last_connection` se guardó correctamente
        if (!req.user.last_connection) {
            logger.error('Error al actualizar la última conexión del usuario');
            return res.status(500).send({ status: "error", message: 'Error al actualizar la última conexión' });
        }

        // Configurar la sesión del usuario usando UserDTO
        const userDTO = new UserDTO(req.user);
        req.session.user = {
            id: userDTO._id,
            nombre: userDTO.nombre,
            apellido: userDTO.apellido,
            email: userDTO.email,
            age: userDTO.age,
            role: userDTO.role,
            last_connection: userDTO.last_connection 
        };

        // Enviar respuesta según el rol del usuario
        if (req.user.role === 'admin') {
            return res.redirect('/api/views/realtimeProducts');
        } else {
            return res.redirect('/api/views/home');
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

exports.logout = async (req, res) => {
    try {
        const userId = req.session.user.id || req.session.user._id;
        // Buscar al usuario por ID para actualizar "last_connection"
        const user = await User.findById(userId);
        if (user) {
            user.last_connection = new Date();
            await user.save();
        }
        req.session.destroy((err) => {
            if (err) {
                logger.error('Error al cerrar sesión: ' + err.message);
                return res.status(500).send('Error al cerrar sesión');
            }

            // Redirigir después de cerrar sesión
            res.redirect('/api/views/login');
        });
    } catch (error) {
        logger.error('Error al cerrar sesión: ' + error.message);
        res.status(500).send({ status: "error", message: 'Error al cerrar sesión' });
    }
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


exports.changeRoles = async (req, res) => {
    try {
        const { id } = req.params;
        const { role } = req.body;
        if (role !== 'user' && role !== 'premium') {
            return res.status(400).json({ error: 'Rol no válido proporcionado' });
        }
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        // Verificar si el usuario tiene al menos 3 documentos para cambiar a premium
        if (role === 'premium' && user.documents.length < 3) {
            return res.status(400).json({ message: 'El usuario debe tener al menos 3 documentos subidos para cambiar al rol premium' });
        }
        user.role = role;
        await userService.updateUser(user);
        // Actualizar la sesión del usuario con el nuevo rol
        req.session.user.role = role;
        req.session.save((err) => {  
            if (err) {
                return res.status(500).json({ error: 'No se pudo actualizar la sesión' });
            }
            res.status(200).json({ message: `Rol de usuario actualizado a ${user.role}` });
        });
    } catch (error) {
        console.error('Error al actualizar el rol del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el rol del usuario: ' + error.message });
    }
};


exports.uploadDocument = async (req, res) => {
    try {
        if (!req.file) {
            logger.warning('No se ha proporcionado ningún archivo para cargar');
            return res.status(400).send('No se ha proporcionado ningún archivo');
        }
        const userId = req.params.id; 
        const user = await userService.getUserById(userId);
        if (!user) {
            logger.warning(`Usuario no encontrado para el ID: ${userId}`);
            return res.status(404).send('Usuario no encontrado');
        }
        // Crear el nuevo documento
        const newDocument = {
            name: req.file.originalname,
            
            reference: req.file.path // Ruta o enlace al archivo
        };
        // Agregar el nuevo documento al array 'documents' del usuario
        user.documents.push(newDocument);
        // Actualizar el estado del documento subido
        const documentType = req.file.mimetype.split('/')[1];
        user.status[documentType] = true; // Marcar como subido

        // Actualizar el usuario con el nuevo documento
        const updatedUser = await userService.updateUser(user);
        logger.info(`Archivo ${req.file.filename} subido y guardado con éxito en la base de datos`);
        res.status(200).send({
            status: 'success',
            message: 'Archivo subido y guardado con éxito',
            file: req.file,
            user: updatedUser
        });
    } catch (error) {
        logger.error('Error al subir y guardar el archivo: ' + error.message);
        res.status(500).send('Error al subir y guardar el archivo');
    }
};