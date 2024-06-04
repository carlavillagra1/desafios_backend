const express = require("express");
const User = require("../dao/models/user.model.js")
const passport = require("passport");
const { isAuthenticated } = require("../public/js/auth.js");

const router = express.Router()

router.post('/register', passport.authenticate('register', {failureRedirect:'failregister'}), async(req,res) =>{
        try {
            res.send({status: "success",  message: "usuario registrado"})
        } catch (err) {
            res.status(500).send('Error al registrar usuario');
        }
})
router.get('/failregister' , async(req,res) =>{
    console.log("estrategia fallida")
    res.send({error: "Fallo"})
})

router.post('/login', passport.authenticate('login', {failureRedirect: 'faillogin'}), async (req, res) => {
    if(!req.user) return res.status(400).send({status: "error", error:"Datos incompletos"}) 
    try {
        req.session.user = {
            nombre: req.user.nombre,
            apellido: req.user.apellido,
            email: req.user.email,
            age: req.user.age,
            role: req.user.role
        };
        // Redirigir basado en el rol del usuario
        if (req.user.role === 'admin') {
            return res.redirect('/api/views/realtimeProducts');
        } else {
            return res.redirect('/api/views/home');
        }

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});
router.get('/faillogin' , async(req,res) =>{
    console.log("login fallido")
    res.send({error: "Login fallido"})
})
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/api/views/login');
    });
})

router.post('/changepassword', async (req, res) => {
    const { email, 'current-password': currentPassword, 'new-password': newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send('Usuario no encontrado');
        }
        // Verificar que la contraseña actual coincida
        const isMatch = await user.comparePassword(currentPassword);
        if (!isMatch) {
            return res.status(400).send('Contraseña actual incorrecta');
        }
        // Actualizar la contraseña
        user.password = newPassword; // El gancho `pre('save')` manejará el hash de la contraseña
        await user.save();
        res.send('Contraseña actualizada exitosamente');
    } catch (err) {
        res.status(500).send('Error al actualizar la contraseña');
    }
});


module.exports = router;