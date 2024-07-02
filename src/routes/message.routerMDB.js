const express = require("express");
const messageController = require("../controllers/messageControllers.js");

const router = express.Router();

// Middleware para manejar errores
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
});

router.get('/', messageController.readMessages);
router.get('/:mid', messageController.messageById);
router.post('/', messageController.createMessage);
router.put('/:mid', messageController.messageUpdate);
router.delete('/:mid', messageController.messageDelete);

module.exports = router;
