const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartControllers.js');
const { isAuthenticated,  isRegularUser, isUserOrPremium  } = require('../public/js/auth.js'); 

router.get('/:cid',isAuthenticated, isUserOrPremium, cartController.getCartById);
router.post('/:cid/product/:id', isAuthenticated, isUserOrPremium, cartController.addProductToCart);
router.post('/',isAuthenticated, isUserOrPremium, cartController.createCart);
router.delete("/:cid/product/:id",isAuthenticated, isUserOrPremium, cartController.removeProductFromCart);
router.put("/:cid/product/:id",isAuthenticated, isUserOrPremium, cartController.updateCart);
router.delete("/:cid", isAuthenticated, isUserOrPremium, cartController.deleteCart);
router.delete('/:cid/clear',isAuthenticated, isUserOrPremium,  cartController.clearCart);
router.post('/:cid/purchase', isAuthenticated, cartController.purchaseCart);

module.exports = router;

