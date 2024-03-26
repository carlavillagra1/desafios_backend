class ProductManager {
    
    constructor() {
        this.products = []
        this. product_id = 1
        
    }

    addProduct(product) {
        if(!this.productValid(product)){
            console.log("Producto no valido")
            return
        }
        if(this.codeDuplicate(product.code)){
            console.log("El codigo ya esta en uso")
            return
        }
        product.id= this.product_id++
        this.products.push(product)
    }
    getProduct() {
        return this.products
    }
    getProductById(product_id) {
        const product_encontrado = this.products.find((product) => product.id === product_id)
        if (product_encontrado) {
            return product_encontrado
        } else{
            console.log("Not Found")
        }

    } 
    productValid(product){
        return(
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        )
    }
    codeDuplicate(code){
        return this.products.some((product)=> product.code === code)
    }


}
const productManager = new ProductManager()

//agregar eventos
productManager.addProduct({
    title: "Producto 1",
    description: "Descripción del producto 1",
    price: 55.90,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'A001',
    stock: 25
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
    title: "Producto 3",
    description: "Descripción del producto 3",
    price: 22.50,
    thumbnail: 'ruta/imagen1.jpg',
    code: 'A003',
    stock: 10
})




const productos = productManager.getProduct()
const producto = productManager.getProductById(1)
console.log(producto)