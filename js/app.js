const fs = require('fs').promises


class ProductManager {
    
    constructor() {
        this.products = []
        this. product_id = 1
        this.path = "Productos.json"
        
    }

    async createProduct(product){
        try {
            let  products = await this.readProducts()
            products.push(product)
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
            console.log("Producto creado correctamente")
        } catch (error) {
            console.error("Error al crear el producto", error)
            
        }

    }

    
    async addProduct(product) {
    try {
        let product = await this.readProducts()
        product.id= this.product_id++
        this.products.push(product)
        await fs.appendFile(this.path, JSON.stringify(product, null,2))
        console.log("Se agrego correctamente el producto")

    } catch (error) {
        console.error("Error al agrgar", error)
        
    }
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

    async getProducts(){
        try {
            return await this.readProducts()
        } catch (error) {
            console.error("Error al consutar productos", error)
            return []
        }

    }
    async readProducts(){
        try {
        const data = await fs.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            //verifica si el archivo esta vacio
            if(error.code === 'ENOENT'){
                return []
            } else{
                throw error
            }
            
        }
    }


getProductById(product_id) {
        const product_encontrado = this.products.find((product) => product.id === product_id)
        if (product_encontrado) {
            return product_encontrado
        } else{
            console.log("Not Found")
        }

    } 


}
module.exports = ProductManager
