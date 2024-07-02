const User = require("../dao/models/user.model.js")
const Cart = require("../dao/models/carts.model.js")



function getAllUsers (){
    return User.getAllUsers()
}
function createUser (newUser){
        User.createUser(newUser)
}



module.exports = { getAllUsers, createUser }