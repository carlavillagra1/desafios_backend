const CartService = require('../services/cartService.js');
const cartService = new CartService();
const TicketService = require("../services/ticketService.js");
const ticketService = new  TicketService()

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

exports.clearCart = async (req, res) => {
    try {
        const { cid } = req.params;
        const clearedCart = await cartService.clearCartProducts(cid);
        res.status(200).json({ message: 'Carrito vaciado con éxito', cart: clearedCart });
    } catch (error) {
        console.error('Error al vaciar el carrito:', error);
        res.status(500).json({ message: 'Error al vaciar el carrito' });
    }
};

exports.purchaseCart = async (req, res) => {
    try {
        if (!req.session.user || !req.session.user._id) {
            return res.status(401).json({ message: 'Autenticación requerida' });
        }
        const userId = req.session.user._id;
        const userName = req.session.user.nombre;
        const userEmail = req.session.user.email;
        const { cid } = req.params;

        // Crear el ticket usando el servicio de tickets
        const ticket = await ticketService.createTicket(userId, cid);

        // Verificar que el ticket y sus productos estén definidos
        if (!ticket || !ticket.cart || !ticket.cart.products) {
            console.log("El ticket no contiene un carrito o productos válidos");
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
        console.error('Error al realizar la compra:', error);
        res.status(500).json({ message: 'Error al realizar la compra: ' + error.message });
    }
};