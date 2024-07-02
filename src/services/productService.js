const ProductManagerMongo = require("../dao/productManagerMDB.js");
const productManager = new ProductManagerMongo();

class ProductService {
    async createProduct(data) {
        const { title, description, price, thumbnail, code, stock, category } = data;
        try {
            const newProduct = await productManager.createProduct(title, description, price, thumbnail, code, stock, category);
            return newProduct;
        } catch (error) {
            throw new Error("Error al crear el producto: " + error.message);
        }
    }

    async getAllProducts() {
        try {
            const products = await productManager.readProducts();
            return products;
        } catch (error) {
            throw new Error("Error al obtener los productos: " + error.message);
        }
    }

    async getProductById(id) {
        try {
            const product = await productManager.getProductById(id);
            return product;
        } catch (error) {
            throw new Error("Error al obtener el producto: " + error.message);
        }
    }

    async updateProduct(id, updatedData) {
        try {
            const product = await productManager.updateProduct(id, updatedData);
            return product;
        } catch (error) {
            throw new Error("Error al actualizar el producto: " + error.message);
        }
    }

    async deleteProduct(id) {
        try {
            const deletedProduct = await productManager.deleteProduct(id);
            return deletedProduct;
        } catch (error) {
            throw new Error("Error al eliminar el producto: " + error.message);
        }
    }

    async paginateProducts(params) {
        try {
            const result = await productManager.paginateProduct(params);
            return result;
        } catch (error) {
            throw new Error("Error al paginar los productos: " + error.message);
        }
    }

    async filterByCategory(params) {
        try {
            const result = await productManager.filterCategory(params);
            return result;
        } catch (error) {
            throw new Error("Error al filtrar los productos por categoría: " + error.message);
        }
    }
}

module.exports = ProductService;
