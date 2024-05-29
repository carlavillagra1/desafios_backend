const mongoose  = require("mongoose")

const messagesColletion = "Messages"

const messagesSchema = new mongoose.Schema({
    user: { type: String, required: true  },
    message: { type: String, required: true}
})

const messagesModel = mongoose.model(messagesColletion, messagesSchema)

module.exports = messagesModel