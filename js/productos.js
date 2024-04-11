const ProductManager = require("./app.js")

const productManager = new ProductManager("Productos.json")
//agregar eventos
/*
productManager.addProduct({
    title: "Producto 3",
    description: "Descripción del producto 3",
    price: 50.00,
    thumbnail: 'ruta/imagen3.jpg',
    code: 'A003',
    stock: 51
})
.then(console.log("Producto agregado correctamente"))
.catch(error=> console.error("Error al agregar", error))

productManager.getProductById(1)
.then((product)=> console.log(product))
.catch(error =>console.error("Error al obtener el id", error) )
*/
//consultar productos
productManager.getProducts()
.then(productos => console.log('Productos', productos))
.catch(error => console.error("Error al consultar productos", error))


productManager.updateProduct(1,{
    title:  "Producto modificado2",
    description:"Descripcion del producto modificado",
    price:46,
    thumbnail: "ruta/imagenModificado.jpg",
    code:"A00M",
    stock: 30
})
.then(console.log("Producto modificado"))
.catch(error => console.log("error al modificar", error))

    
/*
productManager.deleteById(2)
.then(console.log("Producto eliminado"))
.catch(error => console.error("Error al eliminar el producto", error))
productManager.getProductById(2)
*/