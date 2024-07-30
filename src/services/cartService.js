const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const cartManagerMongo = require("../dao/cartsRepository.js");
const productManagerMongo = require("../dao/productRepository.js");
const cartManager = new cartManagerMongo();
const productManager = new productManagerMongo();
const EErrors = require("../services/errors/enums.js")
const CustomErrorCart = require("../services/errors/CustomErrorCart.js")
const { generateCartErrorInfo } = require("../services/errors/info.js")
const logger  = require('../utils/logger.js')

class CartService {
    async createCart(products = [], total = 0) {
        try {
            const newCart = await cartManager.createCart(products, total);
            logger.info('Carrito creado con exito')
            return newCart;
        } catch (error) {
            logger.error('Error al crear el carrito' + error.message)
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    async getAllCarts() {
        try {
            const carts = await cartManager.readCarts();
            logger.info('Carritos leidos con exito')
            return carts;
        } catch (error) {
            logger.error('Error al leer los carritos' + error.message)
            throw new Error("Error al leer los carritos: " + error.message);
        }
    }

    async getCartById(cid) {
        try {
            const cart = await cartManager.cartById(cid);
            logger.info('Carrito encontrado', {cid})
            return cart;
        } catch (error) { 
            logger.error('Error al encontrar el carrito' + error.message)
            throw new Error("Error al encontrar el carrito: " + error.message);
        }
    }

    async getCartByUserId(userId) {
        try {
            const cart = await cartManager.cartFindOne(userId);
            logger.info('Carrito del usuario encontrado con exito')
            return cart;
        } catch (error) {
            logger.error('Error al encontrar el carrito del usuario' + error.message)
            throw new Error("Error al encontrar el carrito del usuario: " + error.message);
        }
    }

    async deleteCart(cid) {
        try {
            const cartDelete = await cartManager.deleteCart(cid);
            logger.info('Carrito eliminado con exito', {cid})
            return cartDelete;
        } catch (error) {
            logger.error('Error al eliminar el carrito' + error.message)
            throw new Error("Error al eliminar el carrito: " + error.message);
        }
    }

    async updateCart(cid, updatedCart) {
        try {
            const cartUpdate = await cartManager.updateCart(cid, updatedCart);
            logger.info('Carrito actualizado con exito')
            return cartUpdate;
        } catch (error) {
            logger.error('Error al actualizar el carrito' + error.message)
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    }
    async addProductToCart(cid, id, quantity) {
        try {
            quantity = Number(quantity);
            if (isNaN(quantity) || quantity <= 0) {
                logger.error('Cantidad invalida')
                throw new Error("Cantidad inválida");
            }
            let cart = await cartManager.cartFindOne(cid);
            if (!cart) {
                cart = await cartManager.createCart(cid); 
            }
            if (!ObjectId.isValid(id)) {
                CustomErrorCart.createError({
                    name: 'InvalidProductIdError',
                    cause: generateCartErrorInfo({cid}, {id}),
                    message: 'ID de producto inválido',
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }
            const product = await productManager.getProductById(id);
            if (!product) {
                CustomErrorCart.createError({
                    name: 'ProductNotFoundError',
                    cause: generateCartErrorInfo({cid}, {id}) ,
                    message: 'Producto no encontrado',
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === id);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                cart.products.push({ product: id, quantity });
            }
            cart.total += product.price * quantity;
            await cartManager.updateCart(cid, cart);
            return cart;
        } catch (error) {
            logger.error('Error al agregar el producto al carrito' + error.message)
            throw error;
        }
    }

    async removeProductFromCart(cid, id) {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) {
                CustomErrorCart.createError({
                    name: 'CartNotFoundError',
                    cause: generateCartErrorInfo({cid}) ,
                    message: 'Carrito no encontrado',
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }
            const productIndex = cart.products.findIndex(product => String(product.product._id) === String(id));
            if (productIndex === -1) {
                CustomErrorCart.createError({
                    name: 'ProductNotFoundError',
                    cause: generateCartErrorInfo({cid}, {id}) ,
                    message: 'Producto no encontrado en el carrito',
                    code: EErrors.INVALID_TYPES_ERROR
                });
            }
    
            const product = cart.products[productIndex];
            const quantity = product.quantity;
            cart.products.splice(productIndex, 1);
            cart.total -= product.price * quantity;
            console.log('Cart contents after removal:', JSON.stringify(cart, null, 2));
    
            await cartManager.updateCart(cid, cart);
            return cart;
        } catch (error) {
            logger.error('Error al eliminar el producto del carrito' + error.message)
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    }
    async clearCartProducts(cid) {
        try {
            return await cartManager.clearCartProducts(cid);
            logger.info('Carrito vaciado con exito')
        } catch (error) {
            logger.error('Error al vaciar el carrito' + error.message)
            throw error;
        }
    }
    
}
module.exports = CartService;
