const UserManager = require('../dao/userManagerMDB.js');
const userManager = new UserManager();

class UserService {
    async registerUser(userData) {
        try {
            const newUser = await userManager.createUser(userData);
            return newUser;
        } catch (error) {
            throw new Error("Error al registrar el usuario: " + error.message);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await userManager.getUserByEmail(email);
            return user;
        } catch (error) {
            throw new Error("Error al obtener el usuario: " + error.message);
        }
    }

    async updateUserPassword(userId, newPassword) {
        try {
            const user = await userManager.updateUserPassword(userId, newPassword);
            return user;
        } catch (error) {
            throw new Error("Error al actualizar la contraseña: " + error.message);
        }
    }
}

module.exports = UserService;
