const express = require("express");

const router = express.Router()

const CartsManager = require("../functions/cartsClass")

const cartclass = new CartsManager("./src/json/Carrito.json")

const ProductManager = require("../functions/productManager")

const productManager = new ProductManager("./src/json/Productos.json")


router.get('/:cid', async(req,res) =>{
    const cartID =parseInt(req.params.cid)
    try {
        const cartsArray = await cartclass.getProductFromCart(cartID)
        res.json(cartsArray)
        
    } catch (error) {
        res.status(404).json({message: "No se encontro el carrito"})
    }

})
router.post('/', async(req,res) =>{
    try {
        const addCart = await cartclass.addToCart()
        res.json(addCart)

    } catch (error) {
        res.status(404).json({message: "Error al agregar un carrito"})
    
    }
})

router.post('/:cid/product/:id', async(req,res) =>{
    try {
    
        const cartID = parseInt(req.params.cid)
        const productID = parseInt(req.params.id)
        const product = await productManager.getProductById(productID)
        if(!product){
            return res.status(404).json({message:"Producto no encontrado"})
        }
        const result = await  cartclass.addToProductCart(cartID, productID)
        res.json(result)
    } catch (error) {
        res.status(404).json({message:"error "})
        
        
    }

})














module.exports = router