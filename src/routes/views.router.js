const express = require("express");
const viewsController = require("../controllers/viewsControllers.js");
const { isAuthenticated, isNotAuthenticated, isAdmin, isUserOrPremium, isAdminOrPremium } = require('../public/js/auth.js'); 

const router = express.Router();

router.get('/home', isAuthenticated, isUserOrPremium,  viewsController.home);
router.get('/productDetail/:id', viewsController.productDetail);
router.get('/chat', isAuthenticated, viewsController.chat);
router.get('/realTimeProducts', isAuthenticated, isAdminOrPremium ,viewsController.realTimeProducts);
router.get('/cart',isAuthenticated, isUserOrPremium, viewsController.cart);
router.get('/restaurar', viewsController.restaurar);
router.get('/login', isNotAuthenticated, viewsController.login);
router.get('/register', isNotAuthenticated, viewsController.register);
router.get('/profile', isAuthenticated, viewsController.profile);
router.get('/tickets/:ticketId', isAuthenticated, isUserOrPremium, viewsController.renderTicket);

router.get('/enviarLink', viewsController.requestPasswordReset);
router.get('/restablecerPass', viewsController.resetPassword); // Vista para introducir la nueva contraseña
router.get('/linkExpirado', viewsController.resetLinkExpired); // Vista para cuando el enlace ha expirado

module.exports = router;

