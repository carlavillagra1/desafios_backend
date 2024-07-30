const ProductManagerMongo = require("../dao/productRepository.js");
const productManager = new ProductManagerMongo();
const logger = require('../utils/logger.js'); 

class ProductService {
    async createProduct(data) {
        let { title, description, price, thumbnail, code, stock, category } = data;
        try {
            const newProduct = await productManager.createProduct(title, description, price, thumbnail, code, stock, category);
            logger.info('Producto creado exitosamente');
            return newProduct;
        } catch (error) {
            logger.error("Error al crear el producto: " + error.message);
            throw new Error("Error al crear el producto: " + error.message);
        }
    }

    async getAllProducts() {
        try {
            const products = await productManager.readProducts();
            logger.info('Productos obtenidos exitosamente');
            return products;
        } catch (error) {
            logger.error("Error al obtener los productos: " + error.message);
            throw new Error("Error al obtener los productos: " + error.message);
        }
    }

    async getProductById(id) {
        try {
            const product = await productManager.getProductById(id);
            logger.info('Producto obtenido por ID', { id });
            return product;
        } catch (error) {
            logger.error("Error al obtener el producto: " + error.message);
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    async updateProduct(id, updatedData) {
        try {
            const product = await productManager.updateProduct(id, updatedData);
            logger.info('Producto actualizado exitosamente', { id });
            return product;
        } catch (error) {
            logger.error("Error al actualizar el producto: " + error.message);
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productManager.deleteProduct(id);
            logger.info('Producto eliminado exitosamente', { id });
            return deletedProduct;
        } catch (error) {
            logger.error("Error al eliminar el producto: " + error.message);
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }

    async paginateProducts(params) {
        try {
            const result = await productManager.paginateProduct(params);
            logger.info('Productos paginados exitosamente');
            return result;
        } catch (error) {
            logger.error("Error al paginar los productos: " + error.message);
            throw new Error("Error al paginar los productos: " + error.message);
        }
    }

    async filterByCategory(params) {
        try {
            const result = await productManager.filterCategory(params);
            logger.info('Productos filtrados por categoría exitosamente');
            return result;
        } catch (error) {
            logger.error("Error al filtrar los productos por categoría: " + error.message);
            throw new Error("Error al filtrar los productos por categoría: " + error.message);
        }
    }
}

module.exports = ProductService;
