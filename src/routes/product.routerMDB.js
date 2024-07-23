const express = require('express');
const router = express.Router();
const productController = require('../controllers/productControllers.js');
const { isAuthenticated, isAdmin, isUser } = require('../public/js/auth.js');


router.post('/', isAuthenticated, isAdmin, productController.createProduct);
router.get('/', isAuthenticated, isUser, productController.getAllProducts);
router.get('/:id', isAuthenticated, isUser, productController.getProductById);
router.put('/:id', isAuthenticated, isAdmin, productController.updateProduct);
router.delete('/:id', isAuthenticated, isAdmin, productController.deleteProduct);
router.get('/paginate', isAuthenticated, isUser, productController.paginateProducts);
router.get('/filtrar/:categoria', isAuthenticated, isUser, productController.filterByCategory);

module.exports = router;
