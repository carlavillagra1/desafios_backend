const express = require('express');
const router = express.Router();
const productController = require('../controllers/productContollers.js');

// Middleware para validar la entrada en la creación y actualización de productos
function validateProduct(req, res, next) {
    const { title, description, price, thumbnail, code, stock } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    next();
}
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/paginate', productController.paginateProducts);
router.get('/filtrar/:categoria', productController.filterByCategory);

module.exports = router;