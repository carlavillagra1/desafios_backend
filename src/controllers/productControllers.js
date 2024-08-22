const CustomError = require('../services/errors/CustomError.js');
const { generateProductErrorInfo } = require('../services/errors/info.js');
const EErrors = require('../services/errors/enums.js');
const ProductService = require('../services/productService.js');
const productService = new ProductService();
const logger = require('../utils/logger.js')
const { getUserOwner } = require('../public/js/auth.js')


exports.createProduct = async (req, res, next) => {
    try {
        if (!req.user || !req.user.role) {
            throw new Error('Usuario no autenticado o falta el rol');
        }
        let { title, description, price, thumbnail, code, stock, category } = req.body;
        const user = req.user; // Asegúrate de incluir el usuario

        // Crear el producto incluyendo el owner
        const newProduct = await productService.createProduct({
            title,
            description,
            price,
            thumbnail,
            code,
            stock,
            category,
            user  // Pasa el usuario aquí
        });
        res.status(201).send({ result: "success", payload: newProduct }); 
    } catch (error) {
        logger.error("Error al crear el producto: " + error.message);
        next(error);
    }
};



exports.getAllProducts = async (req, res) => {
    try {
        const products = await productService.getAllProducts();
        res.status(200).json(products);
    } catch (error) {
        logger.error('Error al obtener los productos' + error.message)
        res.status(500).json({ message: "Error al obtener los productos: " + error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await productService.getProductById(id);
        res.status(200).json(product);
    } catch (error) {
        logger.error('Error al obtener el producto' + error.message)
        res.status(500).json({ message: "Error al obtener el producto: " + error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProduct = await productService.updateProduct(id, req.body);
        // Si no hay modificaciones, podría responderse con un mensaje distinto
        if (updatedProduct.nModified === 0) {
            return res.status(404).json({ message: "No se encontró el producto o no se realizó ninguna modificación" });
        }
        res.status(200).json({ result: 'success' });  // Cambiado para coincidir con lo esperado por el test
    } catch (error) {
        logger.error('Error al actualizar los productos: ' + error.message);
        res.status(500).json({ message: "Error al actualizar el producto: " + error.message });
    }
};


exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const userId = req.session.user._id ||req.session.user.id ; // Asegúrate de que esto esté configurado correctamente
        const userRole = req.session.user.role; // Asegúrate de que esto esté configurado correctamente
        const result = await productService.deleteProduct(id, userId, userRole);
        res.status(200).json({ result: 'success' });
    } catch (error) {
        logger.error('Error al eliminar el producto: ' + error.message);
        res.status(500).json({ message: 'Error al eliminar el producto: ' + error.message });
    }
};
exports.paginateProducts = async (req, res) => {
    try {
        const result = await productService.paginateProducts(req.query);
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error al paginar los productos' + error.message)
        res.status(500).json({ message: "Error al paginar los productos: " + error.message });
    }
};

exports.filterByCategory = async (req, res) => {
    const { categoria } = req.params;
    let { page, limit, sort, query } = req.query;
    // Convertir page y limit a números enteros válidos
    page = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 5;
    try {
        const filterParams = { categoria: categoria === 'productos' ? null : categoria, page, limit: limitNumber, sort, query };
        const result = await productService.filterByCategory(filterParams);

        if (result.docs.length === 0) {
            logger.warning('No se encontraron productos en la categoría');
            return res.status(404).json({ message: "No hay productos para mostrar" });
        }
        res.status(200).json(result);
    } catch (error) {
        logger.error('Error al filtrar los productos por categoria' + error.message)
        res.status(500).json({ message: "Error al filtrar los productos por categoría: " + error.message });
    }
};

