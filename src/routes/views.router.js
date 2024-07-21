const express = require("express");
const viewsController = require("../controllers/viewsControllers.js");
const { isAuthenticated, isNotAuthenticated, isAdmin, isUser  } = require('../public/js/auth.js'); 

const router = express.Router();

router.get('/home', isAuthenticated, isUser,  viewsController.home);
router.get('/productDetail/:id', viewsController.productDetail);
router.get('/chat', isAuthenticated, viewsController.chat);
router.get('/realTimeProducts', isAuthenticated, isAdmin ,viewsController.realTimeProducts);
router.get('/cart',isAuthenticated, isUser, viewsController.cart);
router.get('/restaurar', viewsController.restaurar);
router.get('/login', isNotAuthenticated, viewsController.login);
router.get('/register', isNotAuthenticated, viewsController.register);
router.get('/profile', isAuthenticated, viewsController.profile);
router.get('/tickets/:ticketId', isAuthenticated, isUser, viewsController.renderTicket);

module.exports = router;

