const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketControllers.js');
const { isAuthenticated , isUser } = require('../public/js/auth.js'); 

router.get('/:ticketId', isAuthenticated ,  isUser,  ticketController.getTicketById);


module.exports = router;
