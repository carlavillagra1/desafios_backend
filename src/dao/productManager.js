const fs = require('fs').promises

class ProductManager {

    constructor(path) {
        this.products = []
        this.path = path

    }

    async createProduct(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        } catch (error) {
            throw new Error("Error al actualizar")

        }

    }


    async addProduct(product) {
        try {
            //validar campos requeridos
            if (!this.productValid(product)) {
                throw new Error("Producto no valido")
            }
            //leer el archivo de productos
            const products = await this.readProducts()
            if (this.codeDuplicate(product.code, products)) {
                throw new Error("El codigo ya esta en uso")
            }
            product.id = products.length > 0 ? products[products.length - 1].id + 1 : 1;
            products.push(product)
            await this.createProduct(products)
            return product
        } catch (error) {
            throw error
        }
    }
    productValid(product) {
        return (
            product.title &&
            product.description &&
            product.price &&
            product.thumbnail &&
            product.code &&
            product.stock !== undefined
        )
    }
    codeDuplicate(code, products) {
        return products.some((product) => product.code === code)
    }

    async getProducts() {
        try {
            return await this.readProducts()
        } catch (error) {
            console.error("Error al consutar productos", error)
            return []
        }

    }
    async readProducts() {
        try {
            const data = await fs.readFile(this.path, 'utf8')
            return JSON.parse(data)
        } catch (error) {
            console.error("Error al consultar productos", error)
            //verifica si el archivo esta vacio
            if (error.code === 'ENOENT') {
                //si el archivo no existe lo creamos con un array vacio
                await fs.writeFile(this.path, JSON.stringify([], null, 2))
                return []
            } else {
                throw error
            }

        }
    }


    async getProductById(id) {
        try {
            const products = await this.readProducts()
            const productFound = products.find((product) => product.id === id)
            if (productFound) {
                return productFound
            } 
        } catch (error) {
            throw error

        }

    }
    async refreshProducts (products){
        
        try {
            await fs.writeFile(this.path, JSON.stringify(products))
        } catch (error) {
            throw error
            
        }
    }
    
    async updateProduct(id, obj, campo, valor) {
        const products = await this.readProducts()
        const index = await products.findIndex((product) => product.id === id)
        if (index === -1) {
            console.log("No se encontro el producto")
            await this.createProduct(products)
            
        }
        let newProduct ;
        switch (campo) {
            case "title":
                newProduct = {...products[index], title: valor} 
                products[index] = newProduct
                break;
            case "description":
                newProduct = {...products[index], description: valor} 
                products[index] = newProduct
                break;
            case "price":
                newProduct = {...products[index], price: valor} 
                products[index] = newProduct
                break;
            case "thumbnail":
                newProduct = {...products[index], thumbnail: valor} 
                products[index] = newProduct
                break;
            case "code":
                newProduct = {...products[index], code: valor} 
                products[index] = newProduct
                break;
                case "stock":
                newProduct = {...products[index], stock: valor} 
                products[index] = newProduct
                break;
                case undefined:
                    products[index] = { id: products[index].id, ...obj };
                    break;
        }

        try {
                await this.refreshProducts(products)
        } catch (error) {
            throw new Error("Error al modificar el producto")
        }
    }

    async deleteById(id) {
        let products = await this.readProducts()
        const index = await products.findIndex((product) => product.id == id)
        if (index === -1) {
            throw error("No se encontro el producto para eliminar")
        }
        products = products.filter(product => product.id != id)
        try {
            await this.refreshProducts(products)
        } catch (error) {
            throw new Error("Error al eliminar el producto")

        }
    }

}
module.exports = ProductManager
