const express = require("express");
const messagesManagerMongo = require("../dao/messageManagerMDB.js");
const messageManager = new messagesManagerMongo()

const router = express.Router()

// Middleware para manejar errores
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
});


router.get('/', async (req, res) => {
    try {
        const messages = await messageManager.readMessage()
        res.send({ result: "success", playload: messages })
    } catch (error) {
        next(error)

    }
})
router.get('/:mid', async(req,res) =>{
    try {
        const { mid } = req.params
        const result = await messageManager.messageById(mid)
        res.send({ result:"success", playload: result })
    } catch (error) {
        next(error)
    }
})

router.post('/', async (req, res) => {
    try {
        const { user, message } = req.body
        const result = await messageManager.createMessages(user, message)
        res.send({ result: "success", playload: result })
    } catch (error) {
        next(error)

    }
})
router.put('/:mid', async(req,res) =>{
    try {
        const { mid } = req.params
        const result = await messageManager.messageUpdate(mid)
        res.send({ result: "success", playload: result })
    } catch (error) {
        next(error)
    }
})
router.delete('/:mid', async(req,res) =>{
    try {
        const { mid } = req.params 
        const result = await messageManager.messageDelete(mid)
        res.send({ result: "success", playload: result })
    } catch (error) {
        next(error)
    }
})
module.exports = router