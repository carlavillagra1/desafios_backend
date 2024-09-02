const CartService = require('../services/cartService.js');
const cartService = new CartService();
const TicketService = require("../services/ticketService.js");
const ticketService = new  TicketService()
const ProductService = require('../services/productService.js')
const productService = new ProductService()

const logger = require('../utils/logger.js')

exports.createCart = async (req, res) => {
    try {
        const { products, total } = req.body;
        const newCart = await cartService.createCart(products, total);
        logger.info('Carrito creado con exito')
        res.status(201).json(newCart);
    } catch (error) {
        logger.error('Error al crear el carrito:'+ error.message );
        res.status(500).json({ message: 'Error al crear el carrito' });
    }
};

exports.getAllCarts = async (req, res) => {
    try {
        const carts = await cartService.getAllCarts();
        logger.info('Carritos leidos con exito')
        res.status(200).json(carts);
    } catch (error) {
        logger.error('Error al leer los carritos:' + error.message);
        res.status(500).json({ message: 'Error al leer los carritos' });
    }
};

exports.getCartById = async (req, res) => {
    try {
        const { id } = req.params;
        const cart = await cartService.getCartById(id);
        if (!cart) {
            logger.warning('Carrito no encontrado', { id });
            return res.status(404).json({ message: 'Carrito no encontrado' });
        }
        res.status(200).json(cart);
    } catch (error) {
        logger.error('Error al encontrar el carrito:' + error.message);
        res.status(500).json({ message: 'Error al encontrar el carrito' });
    }
};

exports.getCartByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const cart = await cartService.getCartByUserId(userId);
        if (!cart) {
            logger.warning('Carrito del usuario no encontrado', { id });
            return res.status(404).json({ message: 'Carrito del usuario no encontrado' });
        }
    } catch (error) {
        logger.error('Error al encontrar el carrito del usuario:' + error.message);
        res.status(500).json({ message: 'Error al encontrar el carrito del usuario' });
    }
};

exports.deleteCart = async (req, res) => {
    try {
        const { cid } = req.params;
        await cartService.deleteCart(cid);
        logger.info('Carrito eliminado con éxito');
        res.status(200).json({ message: 'Carrito eliminado con éxito' });
    } catch (error) {
        logger.error('Error al eliminar el carrito:' + error.message);
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

        // Verificar si el producto pertenece al usuario premium
        const product = await productService.getProductById(id); 
        if (!product) {
            logger.error('Producto no encontrado', { productId: id });
            return res.status(404).send('Producto no encontrado');
        }
        const userId = req.session.user ? req.session.user._id : null;
        if (req.session.user && req.session.user.role === 'premium' && product.owner.toString() === userId) {
            logger.warning('Intento de agregar un producto propio al carrito', { productId: id, userId });
            return res.status(403).json({ message: 'No puedes agregar tu propio producto al carrito' });
        }

        // Si quantity no está definido, establece un valor predeterminado de 1
        quantity = quantity ? Number(quantity) : 1;
        if (!quantity || isNaN(quantity) || quantity <= 0) {
            logger.warning('Intento de agregar una cantidad inválida al carrito', { quantity });
            return res.status(400).send('Cantidad inválida');
        }

        const cart = await cartService.addProductToCart(cid, id, quantity, req.session.user);
        res.status(200).json({ result: 'success', cart });
    } catch (error) {
        logger.error('Error al agregar el producto al carrito:', error.message);
        res.status(500).send('Error al agregar el producto al carrito: ' + error.message);
    }
};


exports.removeProductFromCart = async (req, res) => {
    try {
        const { cid, id } = req.params;
        const cart = await cartService.removeProductFromCart(cid, id);
        logger.info('Producto eliminado del carrito')
        res.send({ result: "success", message: "Producto eliminado del carrito", payload: cart });
    } catch (error) {
        logger.error('Error al eliminar el producto del carrito' + error.message)
        res.status(400).json({ message: "Error al eliminar el producto del carrito", error: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const clearedCart = await cartService.clearCartProducts(cid);
        logger.info('Carrito vaciado con exito')
        res.status(200).json({ message: 'Carrito vaciado con éxito', cart: clearedCart });
    } catch (error) {
        logger.error('Error al vaciar el carrito:' + error.message);
        res.status(500).json({ message: 'Error al vaciar el carrito' });
    }
};

exports.purchaseCart = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            logger.warning('Intento de compra sin autenticación', { user: req.session.user });
            return res.status(401).json({ message: 'Autenticación requerida' });
        }
        const userId = req.session.user._id;
        const userEmail = req.session.user.email;
        const { cid } = req.params;

        // Crear el ticket usando el servicio de tickets
        const ticket = await ticketService.createTicket(userId, cid);

        // Verificar que el ticket y sus productos estén definidos
        if (!ticket || !ticket.cart || !ticket.cart.products) {
            logger.error("El ticket no contiene un carrito o productos válidos");
            return res.status(400).json({ message: 'El ticket no contiene un carrito o productos válidos' });
        }
        // Crear el contenido del correo
        const subject = `Ticket de compra: ${ticket._id}`;
        const text = `Gracias por tu compra. Aquí tienes los detalles de tu ticket: ${JSON.stringify(ticket)}`;
        const html = `
            <h1>Gracias por tu compra</h1>
            <p>Aquí tienes los detalles de tu ticket:</p>
            <ul>
                ${ticket.cart.products.map(p => `<li>${p.product.title} - ${p.quantity} x ${p.product.price}</li>`).join('')}
            </ul>
            <p>Total: ${ticket.totalAmount}</p>
            <p>Fecha: ${ticket.createdAt}</p>
        `;

        // Enviar correo electrónico
        await ticketService.endTicketEmail(userEmail, subject, text, html);

        res.status(201).json({ message: 'Compra finalizada con éxito. Ticket creado y correo enviado', payload: ticket });
    } catch (error) {
        logger.error('Error al realizar la compra:' + error.message);
        res.status(500).json({ message: 'Error al realizar la compra: ' + error.message });
    }
};

