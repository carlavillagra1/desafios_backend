const express = require("express");
const cartManagerMongo = require("../dao/cartsManagerMDB.js");
const cartManager = new cartManagerMongo();
const productManagerMongo = require("../dao/productManagerMDB.js")
const productManager = new productManagerMongo()


const router = express.Router()


router.get('/:cid', async (req, res) => {
    try {
        let { cid } = req.params;
        const result = await cartManager.cartById(cid);
        res.send({ result: "success", payload: result });
    } catch (error) {
        res.status(404).json({ message: "No se encontró el carrito" });
    }
});

router.post('/:cid/product/:id', async (req, res) => {
    const { cid, id } = req.params;
    try {
        const cart = await cartManager.cartFindOne(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const existingProductIndex = cart.products.findIndex(p => p.product.toString() === id);
        if (existingProductIndex >= 0) {
            cart.products[existingProductIndex].quantity += 1;
        } else {
            cart.products.push({ product: id, quantity: 1 });
        }
        await cart.save();
        res.redirect('/cart');
        res.send({ result :"success", cart });
    } catch (error) {
        res.status(500).json({ message: "Error al agregar el producto al carrito", error });
    }
});


router.post('/', async (req, res) => {
    try {
        const { products = [], total = 0 } = req.body;
        const cart = await cartManager.createCart(products, total);
        res.send({ result: 'success', payload: cart });
    } catch (error) {
        res.status(400).json({ message: "Error al crear el carrito", error });
    }
});
router.delete("/:cid/product/:id", async (req, res) => {
    try {
        const { cid, id } = req.params;
        const cart = await cartManager.cartById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const productIndex = cart.products.findIndex(product => String(product.product._id) === String(id));
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        cart.products.splice(productIndex, 1);
        await cartManager.updateCart(cid, cart);
        res.send({ result: "success", message: "Producto eliminado del  carrito", payload: cart });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar el producto del carrito", error });
    }
});

router.put("/:cid/product/:id", async (req, res) => {
    try {
        const { cid, id } = req.params;
        const { quantity } = req.body;
        if (quantity <= 0) {
            return res.status(400).json({ message: "La cantidad debe ser mayor que cero" });
        }
        const cart = await cartManager.cartById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        const productIndex = cart.products.findIndex(product => String(product.product._id) === String(id));
        if (productIndex === -1) {
            return res.status(404).json({ message: "Producto no encontrado en el carrito" });
        }
        cart.products[productIndex].quantity = quantity;
        await cartManager.updateCart(cid, cart);
        res.send({ result: "success", payload: cart });
    } catch (error) {
        res.status(400).json({ message: "Error al actualizar la cantidad del producto en el carrito", error });
    }
});

router.delete("/:cid", async (req, res) => {
    try {
        const { cid } = req.params;
        const cart = await cartManager.cartById(cid);
        if (!cart) {
            return res.status(404).json({ message: "Carrito no encontrado" });
        }
        cart.products = [];
        await cartManager.updateCart(cid, cart);
        res.send({ result: "success", message: "Todos los productos han sido eliminados del carrito", payload: cart });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar los productos del carrito", error });
    }
});

module.exports = router