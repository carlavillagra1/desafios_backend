const express = require("express");
const productManagerMongo = require("../dao/productManagerMDB.js");
const productManager = new productManagerMongo();
const router = express.Router();

// Middleware para manejar errores
router.use((error, req, res, next) => {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
});

// Middleware para validar la entrada en la creación y actualización de productos
function validateProduct(req, res, next) {
    const { title, description, price, thumbnail, code, stock } = req.body;
    if (!title || !description || !price || !thumbnail || !code || !stock) {
        return res.status(400).json({ message: "Todos los campos son obligatorios" });
    }
    next();
}

router.get('/', async (req, res) => {
    try {
        const products = await productManager.readProducts();
        res.send({ result: "success", payload: products });
    } catch (error) {
        next(error);
    }
});

router.get('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const product = await productManager.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }
        res.send({ result: "success", payload: product });
    } catch (error) {
        next(error);
    }
});

router.post('/', validateProduct, async (req, res, next) => {
    try {
        const { title, description, price, thumbnail, code, stock } = req.body;
        const result = await productManager.createProduct(title, description, price, thumbnail, code, stock);
        res.send({ result: "success", payload: result });
    } catch (error) {
        next(error);
    }
});

router.put('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productManager.updateProduct(id);
        res.send({ result: "success", payload: result });
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const result = await productManager.deleteProduct(id);
        res.send({ result: "success", payload: result });
    } catch (error) {
        next(error);
    }
});

router.get('/filtrar/:categoria', async (req, res) => {
    try {
        const { categoria } = req.params;
        let { page, limit, sort, query } = req.query;
        // Convertir page y limit a números enteros válidos
        page = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;
        const result = await productManager.filterCategory({ categoria, page, limit: limitNumber, sort, query });
        res.json({ isValid: true, ...result });
    } catch (error) {
        console.error('Error al filtrar productos:', error);
        res.status(500).json({ isValid: false, error: 'Error al filtrar productos' });
    }
});

module.exports = router;




