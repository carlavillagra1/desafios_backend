const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartControllers.js');
const { isAuthenticated,  isUser  } = require('../public/js/auth.js'); 

router.get('/:cid',isAuthenticated, isUser, cartController.getCartById);
router.post('/:cid/product/:id', isAuthenticated, isUser, cartController.addProductToCart);
router.post('/',isAuthenticated, isUser, cartController.createCart);
router.delete("/:cid/product/:id",isAuthenticated, isUser, cartController.removeProductFromCart);
router.put("/:cid/product/:id",isAuthenticated, isUser, cartController.updateCart);
router.delete("/:cid", isAuthenticated, isUser, cartController.deleteCart);
router.delete('/:cid/clear',isAuthenticated, isUser,  cartController.clearCart);
router.post('/:cid/purchase', isAuthenticated, cartController.purchaseCart);

module.exports = router;
