const User = require("./models/user.model.js");

class UserRepository {
    async createUser(userData) {
        try {
            const newUser = await User.create(userData);
            return newUser;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error('El email ya está en uso');
            }
            throw new Error('Error al crear el usuario: ' + error.message);
        }
    }
    async getAllUsers() {
        try {
            const users = await User.find({}, 'nombre apellido email last_connection role');
            return users;
        } catch (error) {
            throw new Error('Error al obtener los usuarios: ' + error.message);
        }
    }
    
    async getUserByEmail(email) {
        try {
            const user = await User.findOne({ email });
            return user;
        } catch (error) {
            throw new Error("Error al obtener el usuario por email: " + error.message);
        }
    }

    async getUserById(id) {
        try {
            const user = await User.findById(id);
            return user;
        } catch (error) {
            throw new Error("Error al obtener el usuario por ID: " + error.message);
        }
    }
    async updateUser(userId, updatedData) {
        try {
            const updatedUser = await User.findByIdAndUpdate(userId, updatedData, { new: true });
            return updatedUser;
        } catch (error) {
            throw new Error("Error al actualizar el usuario: " + error.message);
        }
    }
    

    async updateUserPassword(userId, newPassword) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("Usuario no encontrado");
            }
            user.password = newPassword;
            await user.save();
            return user;
        } catch (error) {
            throw new Error("Error al actualizar la contraseña: " + error.message);
        }
    }
}

module.exports = UserRepository;
