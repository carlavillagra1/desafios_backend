const User = require("../dao/models/user.model.js");
const passport = require("passport");

exports.register = async (req, res) => {
    try {
        res.send({status: "success", message: "usuario registrado"});
    } catch (err) {
        res.status(500).send('Error al registrar usuario');
    }
};

exports.failRegister = async (req, res) => {
    console.log("estrategia fallida");
    res.send({error: "Fallo"});
};

exports.login = async (req, res) => {
    if (!req.user) return res.status(400).send({status: "error", error: "Datos incompletos"});
    try {
        req.session.user = {
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
    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
};

exports.failLogin = async (req, res) => {
    console.log("login fallido");
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
            return res.status(404).send('Usuario no encontrado');
        }
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).send('Contraseña actual incorrecta');
        }
        user.password = newPassword;
        await user.save();
        res.send('Contraseña actualizada exitosamente');
    } catch (err) {
        res.status(500).send('Error al actualizar la contraseña');
    }
};

exports.github = passport.authenticate('github', {scope: 'user.email'});

exports.githubCallback = async (req, res) => {
    req.session.user = req.user;
    res.redirect('/api/views/home');
};
