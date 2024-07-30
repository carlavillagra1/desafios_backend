const MessageRepository = require("../dao/messageRepository.js");
const messageRepository = new MessageRepository();
const logger = require('../utils/logger.js')

exports.createMessage = async ({ user, message }) => {
    try {
        logger.info('Mensaje creado con exito')
        return await messageRepository.createMessage(user, message);
    } catch (error) {
        logger.error('Error al crear el mensaje' + error.message)
        throw error
    }
};

exports.readMessages = async () => {
    try {
        logger.info('Mensajes leidos con exito')
        return await messageRepository.readMessage();
        
    } catch (error) {
        logger.error('Error al leer los mensajes' + error.message)
        throw error
    }
};

exports.messageById = async (mid) => {
    try {
        logger.info('Mensaje leido con exito')
        return await messageRepository.messageById(mid);
    } catch (error) {
        logger.error('Error al leer el mensaje' + error.message)
        throw error
    }
};

exports.messageUpdate = async (mid, { user, message }) => {
    try {
        logger.info('Mensaje modificado con exito')
        return await messageRepository.messageUpdate(mid, { user, message });
    } catch (error) {
        logger.error('Error al modificar el  mensaje' + error.message)
        throw error
    }
};

exports.messageDelete = async (mid) => {
    try {
        logger.info('Mensaje eliminado con exito')
        return await messageRepository.messageDelete(mid);
    } catch (error) {
        logger.error('Error al eliminar el mensaje' + error.message )
        throw error
    }
};
