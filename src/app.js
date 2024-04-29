const express = require("express");
const handlebars = require( "express-handlebars")
const productsRouter = require("./routes/products.router.js")
const cartsRouter = require("./routes/carts.router.js")
const routesView = require("./routes/views.router.js");
const Server = require('socket.io');
const ProductManager = require("./functions/productManager.js");
const productManager = new ProductManager("./src/json/Productos.json")
const app = express()
const port = 8080

const httpServer = app.listen(port, console.log(`Server running on port ${port}`))
const socketServer = Server (httpServer)

app.engine('handlebars', handlebars.engine())
app.set('views', __dirname + '/views')
app.set('view engine','handlebars')
app.use(express.static(__dirname + '/../public'))


app.use(express.urlencoded({extended:true}))
app.use(express.json())


app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use('/',routesView)

socketServer.on('connection', socket =>{
    console.log(" Nuevo cliente conectado")
})

productManager.readProducts()
.then(() => {
    productManager.readProducts()
    .then((products) => {
        socket.emit('products', products)
        socket.emit('responseAdd', "Producto agregado")


    })

.catch((error) => 
        socket.emit('respondeAdd', "Error al agregar el producto" + error.message ))


socket.on('responseDelete', pid =>{
    productManager.deleteById(pid)
    .then(() => {
        productManager.readProducts()
        .then((products) =>{
            socket.emit('products', products)
            socket.emit('responseDelete', "Producto eliminado")
        })
    })
    .catch((error) => 
    socket.emit('responseDelete', "Error al eliminar el producto" + error.message))

})
})