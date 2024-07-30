const TicketService = require("../services/ticketService.js");
const ticketService = new  TicketService()

exports.getTicketById = async (req, res, next) => {
    try {
        const { ticketId } = req.params;
        const ticket = await ticketService.getTicketById(ticketId);
        res.status(200).send({ result: "success", payload: ticket });
    } catch (error) {
        next(new Error("Error al obtener el ticket: " + error.message));
    }
};