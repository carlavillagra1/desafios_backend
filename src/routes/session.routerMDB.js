const express = require("express");
const User = require("../dao/models/user.model.js")

const router = express.Router()

router.post('/register', async(req,res) =>{
        const { nombre, apellido, email, age, password, role } = req.body;
        try {
            const newUser = new User({ nombre, apellido, email, age, password, role});
            await newUser.save();
            res.redirect('/api/views/login');
        } catch (err) {
            res.status(500).send('Error al registrar usuario');
        }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await User.findOne({ email });
        console.log(user)
        if (!user) return res.status(404).send('Usuario no encontrado');
        req.session.user = {
            id: user._id,
            nombre: user.nombre,
            apellido: user.apellido,
            email: user.email,
            age: user.age,
            role: user.role
        };
        console.log(req.session.user)
        // Redirigir basado en el rol del usuario
        if (user.role === 'admin') {
            return res.redirect('/api/views/realtimeProducts');
        } else {
            return res.redirect('/api/views/home');
        }

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/api/views/login');
    });
})

module.exports = router;