const messageService = require("../services/messageService.js");
const logger = require('../utils/logger.js')

exports.createMessage = async (req, res, next) => {
    try {
        const { user, message } = req.body;
        const create = await messageService.createMessage({ user, message });
        logger.info('Mensaje creado con exito')
        res.send({ result: "success", payload: create });
    } catch (error) {
        logger.error('Error al crear el mensaje ' + error.message)
        next(new Error("Error al crear el mensaje"));
    }
};

exports.readMessages = async (req, res, next) => {
    try {
        const messages = await messageService.readMessages();
        logger.info('Mensajes leidos con exito')
        res.send({ result: "success", payload: messages });
    } catch (error) {
        logger.error('Error al leer los mensajes ' + error.message)
        next(new Error("Error al leer los mensajes"));
    }
};

exports.messageById = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const message = await messageService.messageById(mid);
        logger.info('Mensaje leido con exito')
        res.send({ result: "success", payload: message });
    } catch (error) {
        logger.error('Error al encontrar el mensaje ' + error.message)
        next(new Error("Error al encontrar el mensaje"));
    }
};

exports.messageUpdate = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const { user, message } = req.body;
        const messageUpdate = await messageService.messageUpdate(mid, { user, message });
        logger.info('Mensaje editado con exito')
        res.send({ result: "success", payload: messageUpdate });
    } catch (error) {
        logger.error('Error al modificar el mensaje ' + error.message)
        next(new Error("Error al modificar el mensaje"));
    }
};

exports.messageDelete = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const messageDelete = await messageService.messageDelete(mid);
        logger.info('Mensaje eliminado con exito')
        res.send({ result: "success", payload: messageDelete });
    } catch (error) {
        logger.error('Error al eliminar el mensaje ' + error.message)
        next(new Error("Error al eliminar el mensaje"));
    }
};

