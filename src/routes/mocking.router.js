const express = require('express');
const router = express.Router();
const mockingProductController = require('../controllers/mockingProductsControllers.js');
const { isAuthenticated } = require('../public/js/auth.js');

router.get('/mockingproducts', isAuthenticated, mockingProductController.getMockingProducts);

module.exports = router;
