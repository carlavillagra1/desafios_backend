const UserManager = require('../dao/userManager.js');
const userManager = new UserManager();
const logger = require('../utils/logger.js')

class UserService {
    async registerUser(userData) {
        try {
            logger.info(`Verificando existencia del email: ${userData.email}`);
            const existingUser = await userManager.getUserByEmail(userData.email);
            if (existingUser) {
                logger.warning(`Intento de registro con email duplicado: ${userData.email}`);
                throw new Error('El email ya está en uso');
            }

            const newUser = await userManager.createUser(userData);
            return newUser;
        } catch (error) {
            logger.error('Error al registrar el usuario: ' + error.message);
            throw new Error("Error al registrar el usuario: " + error.message);
        }
    }
    async getAllUsers() {
        try {
            const users = await userManager.getAllUsers();
            logger.info('Usuarios obtenidos')
            return users;
        } catch (error) {
            logger.error('Error al obtener todos los usuarios' + error.message)
            throw new Error('Error al obtener todos los usuarios: ' + error.message);
        }
    }

    async getUserById(id) {
        try {
            const user = await userManager.getUserById(id);
            logger.info('Usuario obtenido por id', {id})
            return user;
        } catch (error) {
            logger.error('Error al obtener el usuario por ID' + error.message)
            throw new Error("Error al obtener el usuario por ID: " + error.message);
        }
    }

    async getUserByEmail(email) {
        try {
            const user = await userManager.getUserByEmail(email);
            logger.info('Usuario encontrado', { email })
            return user;
        } catch (error) {
            logger.error('Error al obtener el usuario por email' + error.message)
            throw new Error("Error al obtener el usuario por email: " + error.message);
        }
    }
    async updateUser(user) {
        try {
            const updatedUser = await userManager.updateUser(user._id, user);
            logger.info('Usuario actualizado con éxito', { userId: user._id });
            return updatedUser;
        } catch (error) {
            logger.error('Error al actualizar el usuario: ' + error.message);
            throw new Error('Error al actualizar el usuario: ' + error.message);
        }
    }
    

    async updateUserPassword(userId, newPassword) {
        try {
            const user = await userManager.updateUserPassword(userId, newPassword);
            logger.info('Se actualizo con exito la contraseña', { userId, newPassword })
            return user;
        } catch (error) {
            logger.error('Error al acualizar la contraseña' + error.message)
            throw new Error("Error al actualizar la contraseña: " + error.message);
        }
    }
}

module.exports = UserService;
