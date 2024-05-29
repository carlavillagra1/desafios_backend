const mongoose  = require("mongoose")
const productModel = require("./product.model")

const cartsColletion = "carts"

const cartsSchema = new mongoose.Schema({
    products: [{
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'products', required: true },
        quantity: { type: Number, default: 1 }
    }],
    total: { type: Number, default: 0 }
})

cartsSchema.pre('findOne', function() {
    this.populate('products.product');
});
cartsSchema.pre('findById', function() {
    this.populate('products.product');
});

const cartstModel = mongoose.model(cartsColletion, cartsSchema)

module.exports = cartstModel