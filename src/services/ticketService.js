const moment = require('moment');
const TicketRepository = require('../dao/ticketRepository.js');
const ticketRepository = new TicketRepository()
const { sendTicketByEmail } = require('../public/js/ticketEmail.js'); 
const logger = require('../utils/logger.js')
const dotenv = require('dotenv');
dotenv.config()


class TicketService{
    
    async createTicket(userId) {
        try {
            const user = await ticketRepository.getUserCart(userId);
            if (!user || !user.cart) {
                logger.error('Error al encontrar el usuario o carrito' + error.message)
                throw new Error('Usuario o carrito no encontrado');
            }
            const cart = user.cart;
            const totalAmount = cart.products.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    
            const newTicket = await ticketRepository.createTicket(user._id, cart._id, totalAmount);
            const populatedTicket = await ticketRepository.getTicketById(newTicket._id);
    
            return populatedTicket;
        } catch (error) {
            logger.error('Error al crear el ticket' + error.message)
            throw new Error("Error al crear el ticket: " + error.message);
        }
    }
    
    async  endTicketEmail(userEmail, subject, text, html) {
        try {
            await sendTicketByEmail(userEmail, subject, text, html);
            logger.info('Correo electrónico del ticket enviado con éxito')
        } catch (error) {
            logger.error('Error al enviar el correo electrónico del ticket:' + error.message);
            throw new Error('Error al enviar el correo electrónico del ticket: ' + error.message);
        }
    }

    async getTicketById(ticketId) {
        try {
            const ticket = await ticketRepository.getTicketById(ticketId);

            return {
                email: ticket.user.email,
                products: ticket.cart.products.map(p => ({
                    title: p.product.title,
                    price: p.product.price,
                    quantity: p.quantity
                })),
                totalAmount: ticket.totalAmount,
                createdAt: moment(ticket.createdAt).format('YYYY-MM-DD HH:mm:ss') // Formatear la fecha
            };
        } catch (error) {
            logger.error('Error al  obtener el ticket' + error.message )
            throw new Error("Error al obtener el ticket: " + error.message);
        }

    }

}


module.exports = TicketService; 
