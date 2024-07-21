const express = require("express");
const messageController = require("../controllers/messageControllers.js");
const { isAuthenticated } = require('../public/js/auth.js'); 


const router = express.Router();

// Middleware para manejar errores
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
});

router.get('/', isAuthenticated, messageController.readMessages);
router.get('/:mid', isAuthenticated, messageController.messageById);
router.post('/', isAuthenticated, messageController.createMessage);
router.put('/:mid', isAuthenticated, messageController.messageUpdate);
router.delete('/:mid', isAuthenticated, messageController.messageDelete);

module.exports = router;
