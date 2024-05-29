const messageModel = require("./models/message.model.js")

class  messageMongo{

    async createMessage(user , message){
        try {
            const create = await messageModel.create({user, message})
            return create
        } catch (error) {
            throw new Error("Error al crear el mensaje")
        }
    }

    async readMessage(){
        try {
            const messages = await messageModel.find()
            return messages
        } catch (error) {
            throw new  Error(" Error al leer los mensajes")
        }
    }
    async messageById(mid){
        try {
            const messageId = await messageModel.findById({_id: mid})
            return messageId
        } catch (error) {
            throw new Error("Error al encontrar el mensaje")
        }
    }

    async messageUpdate(mid){
        try {
            const messageUP = await messageModel.updateOne({_id: mid})
            return messageUP
        } catch (error) {
            throw new Error("Error al modificar el mensaje")
        }
    }
    async messageDelete(mid){
        try {
            const messageDE = await messageModel.deleteOne({_id: mid})
            return messageDE
        } catch (error) {
            throw new Error("Error al eliminar el mensaje")
            
        }
    }
}

module.exports = messageMongo 