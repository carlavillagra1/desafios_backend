const mongoose  = require("mongoose")
const mongoosePaginate = require("mongoose-paginate-v2")
const User = require('./user.model.js');  

const productColletion = "products"

const productSchema = new mongoose.Schema({
    title: { type: String, required: true, max: 100 },
    description: { type: String, required: true, max: 100 },
    price: { type: Number, required: true },
    thumbnail: { type: Array, default: [] },
    code: { type: String, required: true, max: 50, unique: true },
    status: { type: Boolean, default: true },
    stock: { type: Number, required: true },
    category: { type: String, required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', default: null }  
});

productSchema.pre('save', async function (next) {
    if (!this.owner) {
        try {
            const admin = await User.findOne({ role: 'admin' });
            if (admin) {
                this.owner = admin._id;
            }
        } catch (err) {
            return next(err);
        }
    };
    next();
});

productSchema.plugin(mongoosePaginate);

const productModel = mongoose.model(productColletion, productSchema)

module.exports = productModel
