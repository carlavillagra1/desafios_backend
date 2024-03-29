const ProductManager = require("./app.js")

const productManager = new ProductManager()
//agregar eventos
productManager.createProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 55.90,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'A001',
    stock: 25,

})
productManager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 30.00,
    thumbnail: 'ruta/imagen2.jpg',
    code: 'A002',
    stock: 30
})
productManager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 3",
    price: 40.00,
    thumbnail: 'ruta/imagen3.jpg',
    code: 'A003',
    stock: 50
})



//consultar productos
productManager.getProducts()
.then(productos => console.log('Productos', productos))
.catch(error => console.error("Error al consultar productos", error))