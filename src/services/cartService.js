const cartManagerMongo = require("../dao/cartsManagerMDB.js");
const productManagerMongo = require("../dao/productManagerMDB.js");
const cartManager = new cartManagerMongo();
const productManager = new productManagerMongo();

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
            // Asegúrate de que quantity es un número
            quantity = Number(quantity);
            if (isNaN(quantity) || quantity <= 0) {
                throw new Error("Cantidad inválida");
            }

            // Obtener el carrito por su ID
            let cart = await cartManager.cartFindOne(cid);
            if (!cart) {
                // Si el carrito no existe, crear uno nuevo
                cart = await cartManager.createCart(cid); // Puedes ajustar los parámetros según sea necesario
            }

            // Obtener el producto por su ID
            const product = await productManager.getProductById(id);
            if (!product) {
                throw new Error("Producto no encontrado");
            }

            // Verificar si el producto ya está en el carrito
            const existingProductIndex = cart.products.findIndex(p => p.product.toString() === id);

            if (existingProductIndex !== -1) {
                // Si el producto ya está en el carrito, actualizar la cantidad
                cart.products[existingProductIndex].quantity += quantity;
            } else {
                // Si el producto no está en el carrito, agregarlo
                cart.products.push({ product: id, quantity });
            }

            // Calcular el nuevo total del carrito
            cart.total += product.price * quantity;

            // Actualizar el carrito en la base de datos
            await cartManager.updateCart(cid, cart);

            return cart;
        } catch (error) {
            console.error(`Error adding product to cart: ${error.message}`);
            throw new Error("Error al agregar el producto al carrito: " + error.message);
        }
    }

    async removeProductFromCart(cid, id) {
        try {
            const cart = await this.getCartById(cid);
            if (!cart) {
                throw new Error("Carrito no encontrado");
                

            }
            const productIndex = cart.products.findIndex(product => String(product.product._id) === String(id));

            console.log('Product Index:', productIndex);
            if (productIndex === -1) {
                return res.status(404).json({ message: "Producto no encontrado en el carrito" });
            }
    
            const product = cart.products[productIndex];
            const quantity = product.quantity;
            cart.products.splice(productIndex, 1);
            cart.total -= product.price * quantity;
            console.log('Cart contents after removal:', JSON.stringify(cart, null, 2));
    
            await cartManager.updateCart(cid, cart);
            return cart;
        } catch (error) {
            console.error(`Error removing product from cart: ${error.message}`);
            throw new Error("Error al eliminar el producto del carrito: " + error.message);
        }
    }
    
}

module.exports = CartService;
