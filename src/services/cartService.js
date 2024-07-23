const mongoose = require('mongoose');
const ObjectId = mongoose.Types.ObjectId;
const cartManagerMongo = require("../dao/cartsRepository.js");
const productManagerMongo = require("../dao/productRepository.js");
const cartManager = new cartManagerMongo();
const productManager = new productManagerMongo();
const EErrors = require("../services/errors/enums.js")
const CustomErrorCart = require("../services/errors/CustomErrorCart.js")
const { generateCartErrorInfo } = require("../services/errors/info.js")

class CartService {
    async createCart(products = [], total = 0) {
        try {
            const newCart = await cartManager.createCart(products, total);
            return newCart;
        } catch (error) {
            throw new Error("Error al crear el carrito: " + error.message);
        }
    }

    async getAllCarts() {
        try {
            const carts = await cartManager.readCarts();
            return carts;
        } catch (error) {
            throw new Error("Error al leer los carritos: " + error.message);
        }
    }

    async getCartById(cid) {
        try {
            const cart = await cartManager.cartById(cid);
            return cart;
        } catch (error) {
            throw new Error("Error al encontrar el carrito: " + error.message);
        }
    }

    async getCartByUserId(userId) {
        try {
            const cart = await cartManager.cartFindOne(userId);
            return cart;
        } catch (error) {
            throw new Error("Error al encontrar el carrito del usuario: " + error.message);
        }
    }

    async deleteCart(cid) {
        try {
            const cartDelete = await cartManager.deleteCart(cid);
            return cartDelete;
        } catch (error) {
            throw new Error("Error al eliminar el carrito: " + error.message);
        }
    }

    async updateCart(cid, updatedCart) {
        try {
            const cartUpdate = await cartManager.updateCart(cid, updatedCart);
            return cartUpdate;
        } catch (error) {
            throw new Error("Error al actualizar el carrito: " + error.message);
        }
    }
    async addProductToCart(cid, id, quantity) {
        try {
            quantity = Number(quantity);
            if (isNaN(quantity) || quantity <= 0) {
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
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    }
    async clearCartProducts(cid) {
        try {
            return await cartManager.clearCartProducts(cid);
        } catch (error) {
            throw error;
        }
    }
    
}
module.exports = CartService;
