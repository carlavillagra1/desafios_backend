const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers.js');
const { isAuthenticated, isAdmin, isUserOrPremium, isAdminOrPremium } = require('../public/js/auth.js');


router.post('/', isAuthenticated, isAdminOrPremium, productController.createProduct);
router.get('/', isAuthenticated, isUserOrPremium, productController.getAllProducts);
router.get('/:id', isAuthenticated, isUserOrPremium, productController.getProductById)
router.put('/:id', isAuthenticated, isAdmin, productController.updateProduct);
router.delete('/:id', isAuthenticated, isAdminOrPremium, productController.deleteProduct);
router.get('/paginate', isAuthenticated, isUserOrPremium, productController.paginateProducts);
router.get('/filtrar/:categoria', isAuthenticated, isUserOrPremium, productController.filterByCategory);

module.exports = router;
