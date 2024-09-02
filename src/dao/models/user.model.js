const mongoose = require("mongoose");
const bcrypt = require('bcrypt')
const Cart = require('./carts.model.js')
const { createHash } = require('../../public/js/utils.js')

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    nombre: { type: String, required: true },
    apellido: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number },
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user', 'premium'], default: 'user' },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
    documents: [
        {
            name: {type: String,
                required: true
            },
            reference: {
                type: String,
                required: true
            }
        }
    ],
    last_connection: { type: Date, default: null},
    status: { type: Object, default: {} }, // Añadido para registrar el estado de los documentos subidos
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
    const user = this
    if (user.isModified('password') && user.password) {
        user.password = await bcrypt.hash(user.password, 10)
    }
    next()
})

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password)
}

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;


