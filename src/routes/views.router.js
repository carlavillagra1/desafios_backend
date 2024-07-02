const express = require("express");
const viewsController = require("../controllers/viewsControllers.js");
const { isAuthenticated, isNotAuthenticated } = require('../public/js/auth.js'); 

const router = express.Router();

router.get('/home', isAuthenticated, viewsController.home);
router.get('/productDetail/:id', viewsController.productDetail);
router.get('/chat', viewsController.chat);
router.get('/realTimeProducts', isAuthenticated, viewsController.realTimeProducts);
router.get('/cart', viewsController.cart);
router.get('/restaurar', viewsController.restaurar);
router.get('/login', isNotAuthenticated, viewsController.login);
router.get('/register', isNotAuthenticated, viewsController.register);
router.get('/profile', isAuthenticated, viewsController.profile);

module.exports = router;

