const ProductManager = require("./app.js")

const productManager = new ProductManager()
//agregar eventos
/*
productManager.createProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 55.90,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'A001',
    stock: 25,

})
productManager.addProduct({
    title: "Producto 4",
    description: "Descripción del producto 4",
    price: 50.00,
    thumbnail: 'ruta/imagen4.jpg',
    code: 'A004',
    stock: 50
})
*/


//consultar productos
productManager.getProducts()
.then(productos => console.log('Productos', productos))
.catch(error => console.error("Error al consultar productos", error))

console.log(productManager.getProductById("1"))