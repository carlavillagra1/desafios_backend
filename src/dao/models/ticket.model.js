const mongoose = require("mongoose");

const ticketCollection = "Tickets";

const ticketSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts', required: true },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
});


const ticketModel = mongoose.model(ticketCollection, ticketSchema);

module.exports = ticketModel;
