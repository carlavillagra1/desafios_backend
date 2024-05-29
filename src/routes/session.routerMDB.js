const express = require("express");
const user = require("../dao/models/user.model.js")

const router = express.Router()

router.post('/register', async(req,res) =>{
        const { nombre, apellido, email, age, password, role } = req.body;
        try {
            const newUser = new user({ nombre, apellido, email, age, password, role});
            await newUser.save();
            res.redirect('/login');
        } catch (err) {
            res.status(500).send('Error al registrar usuario');
        }
})

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, password)
    try {
        const user = await user.findOne({ email });
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
        res.redirect('/profile');

    } catch (err) {
        res.status(500).send('Error al iniciar sesión');
    }
});
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) return res.status(500).send('Error al cerrar sesión');
        res.redirect('/login');
    });
})

module.exports = router;