const productModel = require("./models/product.model.js")
const cartsModel  = require("./models/carts.model.js")
const CustomError = require('../services/errors/CustomError.js');
const { generateProductErrorInfo } = require('../services/errors/info.js');
const EErrors = require('../services/errors/enums.js');

class productManagerMongo {

    async createProduct(title, description, price, thumbnail, code, stock, category) {
        try {
            if (!title || !description || !price || !thumbnail || !code || !stock || !category) {
                CustomError.createError({
                    name: 'InvalidProductError',
                    cause: generateProductErrorInfo({ title, description, price, thumbnail, code, stock, category }),
                    message: 'Error al crear el producto: Información inválida',
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }
            const create = await productModel.create({ title, description, price, thumbnail, code, stock, category });
            return create;
        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            } else {
                throw new Error("Error al crear el producto: " + error.message);
            }
        }
    }

    async readProducts() {
        try {
            const products = await productModel.find().lean()
            return products
        } catch (error) {
            console.log('Error al obtener los productos en el repositorio:', error); // Agrega logs para depuración
            throw new Error("Error al leer los productos")

        }
    }

    async getProductById(id) {
        try {
            const productFound = await productModel.findById(id).lean()
            if (productFound) {
                return productFound;
            } else {
                throw new Error("El producto no pudo ser encontrado");
            }
        } catch (error) {
            throw new Error("Error al encontrar el producto: " + error.message);
        }
    }
    
    async updateProduct(id) {
        try {
            const productUpdate = await productModel.updateOne({_id: id})
            return productUpdate
        } catch (error) {
            throw new Error("Error al modificar el producto")

        }
    }
    async deleteProduct(id) {
        try {
            const productDelete = await productModel.deleteOne({_id: id})
            return productDelete
        } catch (error) {
            throw new Error("Error al eliminar el producto")
        }
    }
    async  paginateProduct({ page = 1, limit = 5, sort = '', query = '', categoria = '' }) {
        try {
            const match = {};
            if (categoria) {
                match.category = categoria;
            }
            if (query) {
                match.title = { $regex: query, $options: 'i' };
            }
    
            const sortOrder = sort === 'desc' ? -1 : 1;
            const skip = (page - 1) * limit;
    
            const productos = await productModel.aggregate([
                { $match: match },
                { $sort: { price: sortOrder } },
                { $skip: skip },
                { $limit: parseInt(limit) }
            ]);
    
            const totalDocs = await productModel.countDocuments(match);
            const totalPages = Math.ceil(totalDocs / limit);
    
            return {
                docs: productos,
                totalDocs,
                limit,
                page,
                totalPages,
                hasPrevPage: page > 1,
                hasNextPage: page < totalPages,
                prevPage: page > 1 ? page - 1 : null,
                nextPage: page < totalPages ? page + 1 : null,
            };
        } catch (error) {
            throw new Error("Error en paginación de productos: " + error.message);
        }
    }

   // Función para filtrar productos por categoría
async filterCategory({ categoria, limit = 10, page = 1, sort, query }) {
    try {
        // Si 'categoria' es null, no filtramos por categoría
        const match = categoria ? { category: categoria } : {};
        if (query) {
            match.title = { $regex: query, $options: 'i' };
        }
        const sortOrder = sort === 'desc' ? -1 : 1;
        const skip = (page - 1) * limit;

        const categorias = await productModel.aggregate([
            { $match: match },
            { $sort: { price: sortOrder } },
            { $skip: skip },
            { $limit: parseInt(limit) }
        ]);

        const totalDocs = await productModel.countDocuments(match);
        const totalPages = Math.ceil(totalDocs / limit);

        return {
            docs: categorias,
            totalDocs,
            limit,
            page,
            totalPages,
            hasPrevPage: page > 1,
            hasNextPage: page < totalPages,
            prevPage: page > 1 ? page - 1 : null,
            nextPage: page < totalPages ? page + 1 : null
        };
    } catch (error) {
        throw new Error(`Error en filtrar por categorías: ${error.message}`);
    }
}

}



module.exports = productManagerMongo