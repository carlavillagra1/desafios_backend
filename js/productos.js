const ProductManager = require("./app.js")

const productManager = new ProductManager()
//agregar eventos

productManager.addProduct({
    title: "Producto 2",
    description: "Descripción del producto 2",
    price: 50.00,
    thumbnail: 'ruta/imagen2.jpg',
    code: 'A002',
    stock: 50
})


//consultar productos
productManager.getProducts()
.then(productos => console.log('Productos', productos))
.catch(error => console.error("Error al consultar productos", error))

productManager.getProductById(1)
.then((product)=> console.log(product))



productManager.updateProduct(2,{
    title:  "Producto modificado2",
    description:"Descripcion del producto modificado",
    price:46,
    thumbnail: "ruta/imagenModificado.jpg",
    code:"A00M",
    stock: 30
})
    product = productManager.getProductById(2)
    console.log(product)

productManager.deleteById(2)
productManager.getProductById(2)
