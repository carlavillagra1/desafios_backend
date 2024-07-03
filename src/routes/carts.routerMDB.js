const express = require("express");
const router = express.Router();
const cartController = require('../controllers/cartControllers.js');

router.get('/:cid', cartController.getCartById);
router.post('/:cid/product/:id', cartController.addProductToCart);
router.post('/', cartController.createCart);
router.delete("/:cid/product/:id", cartController.removeProductFromCart);
router.put("/:cid/product/:id", cartController.updateCart);
router.delete("/:cid", cartController.deleteCart);

module.exports = router;
