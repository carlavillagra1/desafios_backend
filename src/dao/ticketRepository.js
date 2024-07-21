const Ticket = require("./models/ticket.model.js");
const User = require("./models/user.model.js");
const Cart = require("./models/carts.model.js");

class TicketRepository {
    async createTicket(userId, cartId, totalAmount) {
        try {
            const newTicket = await Ticket.create({
                user: userId,
                cart: cartId,
                totalAmount
            });
            return newTicket;
        } catch (error) {
            throw new Error("Error al crear el ticket: " + error.message);
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await Ticket.findById(ticketId).populate('user').populate({
                path: 'cart',
                populate: {
                    path: 'products.product'
                }
            });

            if (!ticket) {
                throw new Error('Ticket no encontrado');
            }

            return ticket;
        } catch (error) {
            throw new Error("Error al obtener el ticket: " + error.message);
        }
    }

    async getUserCart(userId) {
        try {
            const user = await User.findById(userId).populate({
                path: 'cart',
                populate: {
                    path: 'products.product'
                }
            });
            return user;
        } catch (error) {
            throw new Error('Error al obtener el carrito del usuario: ' + error.message);
        }
    }
}

module.exports = TicketRepository;
