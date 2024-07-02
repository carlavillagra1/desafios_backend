const ProductService = require('../services/productService.js');
const productService = new ProductService();

exports.createProduct = async (req, res) => {
    try {
        const newProduct = await productService.createProduct(req.body);
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al crear el producto: " + error.message });
    }
};

exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: "Error al obtene os productos: " + error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener el producto: " + error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productService.updateProduct(id, req.body);
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar el producto: " + error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedProduct = await productService.deleteProduct(id);
        res.status(200).json(deletedProduct);
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar el producto: " + error.message });
    }
};

exports.paginateProducts = async (req, res) => {
    try {
        const result = await productService.paginateProducts(req.query);
        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al paginar los productos: " + error.message });
    }
};
exports.filterByCategory = async (req, res) => {
    const { categoria } = req.params;
    let { page, limit, sort, query } = req.query;
    try {
        // Convertir page y limit a números enteros válidos
        page = parseInt(page, 10) || 1;
        const limitNumber = parseInt(limit, 10) || 5;
        const result = await productService.filterByCategory({ categoria, page, limit: limitNumber, sort, query });

        if (result.docs.length === 0) {
            return res.status(404).json({ message: "No hay productos para mostrar controller" });
        }

        res.status(200).json(result);
    } catch (error) {
        res.status(500).json({ message: "Error al filtrar los productos por categoría: " + error.message });
    }
};
