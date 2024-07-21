const messageService = require("../services/messageService.js");

exports.createMessage = async (req, res, next) => {
    try {
        const { user, message } = req.body;
        const create = await messageService.createMessage({ user, message });
        res.send({ result: "success", payload: create });
    } catch (error) {
        next(new Error("Error al crear el mensaje"));
    }
};

exports.readMessages = async (req, res, next) => {
    try {
        const messages = await messageService.readMessages();
        res.send({ result: "success", payload: messages });
    } catch (error) {
        next(new Error("Error al leer los mensajes"));
    }
};

exports.messageById = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const message = await messageService.messageById(mid);
        res.send({ result: "success", payload: message });
    } catch (error) {
        next(new Error("Error al encontrar el mensaje"));
    }
};

exports.messageUpdate = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const { user, message } = req.body;
        const messageUpdate = await messageService.messageUpdate(mid, { user, message });
        res.send({ result: "success", payload: messageUpdate });
    } catch (error) {
        next(new Error("Error al modificar el mensaje"));
    }
};

exports.messageDelete = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const messageDelete = await messageService.messageDelete(mid);
        res.send({ result: "success", payload: messageDelete });
    } catch (error) {
        next(new Error("Error al eliminar el mensaje"));
    }
};
