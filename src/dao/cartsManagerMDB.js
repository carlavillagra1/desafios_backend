const cartsModel  = require("./models/carts.model.js")
const productModel = require("./models/product.model.js")

class cartManagerMongo{
    
    async createCart(products = [] , total = 0 ){
        try {
            const cart = new cartsModel({ products, total});
            return await cart.save();
        }
        catch (error) {
            throw new Error("Error al crear carrito")
        }

    }
    async readCarts(){
        try {
            const carts = await cartsModel.find().lean()
            return carts
        } catch (error) {
            throw new Error("Error al leer los carritos")
        }
    }
    async cartById(cid) {
        try {
            const cart = await cartsModel.findById(cid).lean()
            if (!cart) {
                const newCart = new cartsModel({ _id: cid, products: [], total: 0 });
                await newCart.save();
                return newCart;
            }
            return cart;
        } catch (error) {
            throw new Error("Error al encontrar el carrito");
        }
    }

    async cartFindOne(cid) {
        try {
            let cart = await cartsModel.findOne({ _id: cid });
            console.log("Carrito encontrado:", JSON.stringify(cart, null, '\t')); 
            if (!cart) {
                cart = new cartsModel({ _id: cid, products: [], total: 0 });
                await cart.save();
            }
            return cart;
        } catch (error) {
            throw new Error("Error al encontrar el carrito")
        }
    }

    async deleteCart (cid){
        try {
            const cartDelete = await cartsModel.deleteOne({_id: cid}) 
            return cartDelete
        } catch (error) {
            throw new Error("Error al eliminar el carrito")
        }
    }
    async updateCart(cid, updatedCart) {
        try {
            const cartUpdate = await cartsModel.updateOne(
                { _id: cid },
                { $set: { products: updatedCart.products } }
            );
            console.log('Cart updated:', cartUpdate); // Log para verificar la actualización
            return cartUpdate;
        } catch (error) {
            console.error('Error updating cart:', error); // Log de error
            throw new Error("Error al actualizar el carrito");
        }
    }
    
}
module.exports = cartManagerMongo