const mongoose = require("mongoose");

const userCollection = "Users";

const userSchema = new mongoose.Schema({
    nombre: { type: String,  required: true},
    apellido: {type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: {type: Number},
    password: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const userModel = mongoose.model(userCollection, userSchema);

module.exports = userModel;






