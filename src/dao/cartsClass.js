const fs = require('fs').promises

class CartsManager {

    constructor(cartPath) {
        this.carts = []
        this.cartPath = cartPath
    }
    async createCart(carts) {
        try {
            await fs.writeFile(this.cartPath, JSON.stringify(carts, null, 2))
        } catch (error) {
            throw new Error("Error al actualizar")
        }
    }

    async addToCart(cartID) {
        try {
            //busco array de carritos
            const carts = await this.readCart()
            //busco si existe carrito con el mismo id 
            let cart = carts.find((c) => c.id === parseInt(cartID))
            //si existe creo otro incrementando el id
            if (!cart) {
                cart = {
                    id: carts.length > 0 ? carts[carts.length - 1].id + 1 : 1,
                    products: [],
                }
                carts.push(cart)
                await this.createCart(carts)
                return cart
            }
        } catch (error) {
            throw error
        }
    }


    async addToProductCart (cartID, productID){
          //busco array de carritos
            const carts = await this.readCart()
            //busco si existe carrito con el mismo id 
            const cart = carts.find((c) => c.id === parseInt(cartID))
        try {

            const producIndex = cart.products.findIndex((p) => p.productID === parseInt(productID))
            if (producIndex !== -1) {
                cart.products[producIndex].quantity++

            }
            else {
                cart.products.push({ productID, quantity: 1 })
            }
            await this.createCart(carts)
            return cart

            
        } catch (error) {
            throw new Error("Error al agregar productos al  carrito")
        }

    }
    async readCart() {
        try {
            const dataCart = await fs.readFile(this.cartPath, 'utf8')
            return JSON.parse(dataCart)
        } catch (error) {
            console.error("Error al consultar carritos")
            if (error.code === 'ENOENT') {
                await fs.writeFile(this.cartPath, JSON.stringify([], null, 2))
                return []
            }
            else {
                throw new Error("Error al consultar carritos")
            }
        }
    }

    async getProductFromCart(cartID) {

        const  listCarts = await this.readCart()
        try {
            const cart = listCarts.find ( cart => cart.id === cartID);
            return cart.products
            
        } catch (error) {
            throw new Error("Error al obtener los productos del carrito")
        }
    }
}


module.exports = CartsManager 