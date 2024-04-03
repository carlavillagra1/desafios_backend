

const fs = require('fs').promises


class ProductManager {

    constructor() {
        this.products = []
        this.path = "Productos.json"

    }

    async createProduct(products) {
        try {
            await fs.writeFile(this.path, JSON.stringify(products, null, 2))
        } catch (error) {
            console.error("Error al crear el producto", error)

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
            console.log("Producto agrgado correctamente")
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
            const product_encontrado = products.find((product) => product.id === id)
            if (product_encontrado) {
                return product_encontrado
            }else{
                console.log("No se encontro el  producto")
            }
        } catch (error) {
            throw error

        }

    }


}
module.exports = ProductManager
