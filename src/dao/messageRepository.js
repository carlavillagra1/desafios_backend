const messageModel = require("./models/message.model.js");

class MessageRepository {
    async createMessage(user, message) {
        try {
            const create = await messageModel.create({ user, message });
            return create;
        } catch (error) {
            throw new Error("Error al crear el mensaje: " + error.message);
        }
    }

    async readMessage() {
        try {
            const messages = await messageModel.find().lean()
            return messages;
        } catch (error) {
            throw new Error("Error al leer los mensajes: " + error.message);
        }
    }

    async messageById(mid) {
        try {
            const messageId = await messageModel.findById(mid);
            return messageId;
        } catch (error) {
            throw new Error("Error al encontrar el mensaje: " + error.message);
        }
    }

    async messageUpdate(mid, data) {
        try {
            const messageUP = await messageModel.findByIdAndUpdate(mid, data, { new: true });
            return messageUP;
        } catch (error) {
            throw new Error("Error al modificar el mensaje: " + error.message);
        }
    }

    async messageDelete(mid) {
        try {
            const messageDE = await messageModel.findByIdAndDelete(mid);
            return messageDE;
        } catch (error) {
            throw new Error("Error al eliminar el mensaje: " + error.message);
        }
    }
}

module.exports = MessageRepository;
