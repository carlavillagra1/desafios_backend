const messageModel = require("../dao/models/message.model.js");

exports.createMessage = async (req, res, next) => {
    try {
        const { user, message } = req.body;
        const create = await messageModel.create({ user, message });
        res.send({ result: "success", payload: create });
    } catch (error) {
        next(new Error("Error al crear el mensaje"));
    }
};

exports.readMessages = async (req, res, next) => {
    try {
        const messages = await messageModel.find();
        res.send({ result: "success", payload: messages });
    } catch (error) {
        next(new Error("Error al leer los mensajes"));
    }
};

exports.messageById = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const message = await messageModel.findById(mid);
        res.send({ result: "success", payload: message });
    } catch (error) {
        next(new Error("Error al encontrar el mensaje"));
    }
};

exports.messageUpdate = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const { user, message } = req.body;
        const messageUpdate = await messageModel.findByIdAndUpdate(mid, { user, message }, { new: true });
        res.send({ result: "success", payload: messageUpdate });
    } catch (error) {
        next(new Error("Error al modificar el mensaje"));
    }
};

exports.messageDelete = async (req, res, next) => {
    try {
        const { mid } = req.params;
        const messageDelete = await messageModel.findByIdAndDelete(mid);
        res.send({ result: "success", payload: messageDelete });
    } catch (error) {
        next(new Error("Error al eliminar el mensaje"));
    }
};
