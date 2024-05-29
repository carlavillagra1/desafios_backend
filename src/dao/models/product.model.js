const mongoose  = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")

const productColletion = "products"

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    price: { type: Number , required: true },
    thumbnail: { type: Array, default: [] },
    code: { type: String, required: true, max: 50 },
    status: { type: Boolean , default: true},
    stock: { type: Number , required: true },
    category: {type: String, required: true},
    
})

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productColletion, productSchema)

module.exports = productModel