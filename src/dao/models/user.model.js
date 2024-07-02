const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Cart = require('./carts.model.js')

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    nombre: { type: String,  required: true},
    apellido: {type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: {type: Number},
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' }
});


userSchema.pre('save', async function (next) {
    // Verifica si el usuario ya tiene un carrito asignado
    if (!this.cart) {
        try {
            // Crea un nuevo carrito vacío
            const newCart = await Cart.create({});
            // Asigna el ID del carrito al usuario
            this.cart = newCart._id;
            next();
        } catch (err) {
            next(err);
        }
    } else {
        // Si el usuario ya tiene un carrito, pasa al siguiente middleware
        next();
    }
});
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};


const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;


