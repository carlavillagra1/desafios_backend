const MessageRepository = require("../dao/messageRepository.js");
const messageRepository = new MessageRepository();

exports.createMessage = async ({ user, message }) => {
    return await messageRepository.createMessage(user, message);
};

exports.readMessages = async () => {
    return await messageRepository.readMessage();
};

exports.messageById = async (mid) => {
    return await messageRepository.messageById(mid);
};

exports.messageUpdate = async (mid, { user, message }) => {
    return await messageRepository.messageUpdate(mid, { user, message });
};

exports.messageDelete = async (mid) => {
    return await messageRepository.messageDelete(mid);
};
