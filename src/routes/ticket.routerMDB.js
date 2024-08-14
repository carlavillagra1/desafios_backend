const express = require('express');
const router = express.Router();
const ticketController = require('../controllers/ticketControllers.js');
const { isAuthenticated , isUserOrPremium } = require('../public/js/auth.js'); 

router.get('/:ticketId', isAuthenticated ,  isUserOrPremium,  ticketController.getTicketById);


module.exports = router;
