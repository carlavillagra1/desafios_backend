const ProductManager = require("./productManager")

const productManager = new ProductManager("Productos.json")
//agregar eventos

productManager.addProduct({
    title: "Producto 7",
    description: "Descripción del producto 7",
    price: 50.00,
    thumbnail: 'ruta/imagen7.jpg',
    code: 'A007',
    stock: 51
})
.then(console.log("Producto agregado correctamente"))
.catch(error=> console.error("Error al agregar", error))

productManager.getProductById(1)
.then((product)=> console.log(product))
.catch(error =>console.error("Error al obtener el id", error) )

//consultar productos
productManager.getProducts()
.then(productos => console.log('Productos', productos))
.catch(error => console.error("Error al consultar productos", error))

/*
productManager.updateProduct(1,{
    title:  "Producto 1",
    description:"Descripcion del producto 1",
    price:46,
    thumbnail: "ruta/imagen1.jpg",
    code:"A001",
    stock: 30
})
.then(console.log("Producto modificado"))
.catch(error => console.log("error al modificar", error))

    

productManager.deleteById(2)
.then(console.log("Producto eliminado"))
.catch(error => console.error("Error al eliminar el producto", error))
productManager.getProductById(2)
*/