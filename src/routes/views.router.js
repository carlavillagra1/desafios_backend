const ProductManager = require('../functions/productManager')
const productManager = new ProductManager('./src/json/Productos.json')
const { Router } = require("express")
const router = Router()

router.get('/' , async(req,res) =>{
    try {
    const products = await productManager.readProducts()
        res.render("home", {products})
    } catch (error) {
        res.status(404).json({message: "Error al obtener los productos"})
    }

})

router.get('/realTimeProducts', (req, res) => {
    res.render("realTimeProducts", {})
})

module.exports = router;