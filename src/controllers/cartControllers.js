const CartService = require('../services/cartService.js');
const cartService = new CartService();

exports.createCart = async (req, res) => {
    try {
        const { products, total } = req.body;
        const newCart = await cartService.createCart(products, total);
        res.status(201).json(newCart);
    } catch (error) {
        console.error('Error al crear el carrito:', error);
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
};

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        res.status(200).json(carts);
    } catch (error) {
        console.error('Error al leer los carritos:', error);
        res.status(500).json({ message: 'Error al leer los carritos' });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await cartService.getCartById(id);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al encontrar el carrito:', error);
        res.status(500).json({ message: 'Error al encontrar el carrito' });
    }
};

exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartService.getCartByUserId(userId);
        res.status(200).json(cart);
    } catch (error) {
        console.error('Error al encontrar el carrito del usuario:', error);
        res.status(500).json({ message: 'Error al encontrar el carrito del usuario' });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedCart = await cartService.deleteCart(id);
        res.status(200).json(deletedCart);
    } catch (error) {
        console.error('Error al eliminar el carrito:', error);
        res.status(500).json({ message: 'Error al eliminar el carrito' });
    }
};

exports.updateCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const updatedCart = req.body;
        const result = await cartService.updateCart(cid, updatedCart);
        res.status(200).json(result);
    } catch (error) {
        console.error('Error al actualizar el carrito:', error);
        res.status(500).json({ message: 'Error al actualizar el carrito' });
    }
};

exports.addProductToCart = async (req, res) => {
    try {
        const { cid, id } = req.params;
        let { quantity } = req.body;
        console.log(`Received parameters: cartId=${cid}, productId=${id}, quantity=${quantity}`);
        console.log(`Body: ${JSON.stringify(req.body)}`);
        // Si quantity no está definido, establece un valor predeterminado de 1
        quantity = quantity ? Number(quantity) : 1;
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            return res.status(400).send('Cantidad inválida');
        }
        const cart = await cartService.addProductToCart(cid, id, quantity);
        res.redirect(`/api/views/cart?cid=${cid}`);
    } catch (error) {
        console.error('Error adding product to cart:', error.message);
        res.status(500).send('Error al agregar el producto al carrito: ' + error.message);
    }
};

exports.removeProductFromCart = async (req, res) => {
    try {
        const { cid, id } = req.params;
        const cart = await cartService.removeProductFromCart(cid, id);
        res.send({ result: "success", message: "Producto eliminado del carrito", payload: cart });
    } catch (error) {
        res.status(400).json({ message: "Error al eliminar el producto del carrito", error: error.message });
    }
};
