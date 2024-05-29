const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({path: path.resolve(__dirname, "../../.env")})


mongoose.connect(process.env.MONGODB)

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log('Connected to MongoDB');
});
console.log(process.env.MONGODB);

module.exports = db; 