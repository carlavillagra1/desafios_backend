const UserManager = require('../dao/userManagerMDB.js');
const userManager = new UserManager();
const logger = require('../utils/logger.js')

class UserService {
    async registerUser(userData) {
        try {
            const newUser = await userManager.createUser(userData);
            logger.info('Usuario registrado con exito', {userData})
            return newUser;
        } catch (error) {
            logger.error('Error al registrar el usuario' + error.message)
            throw new Error("Error al registrar el usuario: " + error.message);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await userManager.getUserByEmail(email);
            logger.info('Usuario encontrado', {email})
            return user;
        } catch (error) {
            logger.error('Error al obtener el usuario' + error.message)
            throw new Error("Error al obtener el usuario: " + error.message);
        }
    }

    async updateUserPassword(userId, newPassword) {
        try {
            const user = await userManager.updateUserPassword(userId, newPassword);
            logger.info('Se actualizo con exito la contraseña', {userId, newPassword})
            return user;
        } catch (error) {
            logger.error('Error al acualizar la contraseña' + error.message)
            throw new Error("Error al actualizar la contraseña: " + error.message);
        }
    }
}

module.exports = UserService;
