const express = require("express");
const cartManagerMongo = require("../dao/cartsManagerMDB");
const cartManager = new cartManagerMongo();
const productManagerMongo = require("../dao/productManagerMDB.js");
const productManager = new productManagerMongo();
const { isAuthenticated, isNotAuthenticated } = require('../public/js/auth.js'); 
const router = express.Router();

router.get('/home', isAuthenticated , async(req, res) => {
    try {
        let page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        let sort = req.query.sort || '';
        let query = req.query.query || '';
        let categoria = req.query.categoria || '';

        const result = await productManager.paginateProduct({ page, limit, sort, query, categoria });
        result.prevLink = result.hasPrevPage ? `http://localhost:8080/api/views/home?page=${result.prevPage}&limit=${limit}&sort=${sort}&query=${query}&categoria=${categoria}` : '';
        result.nextLink = result.hasNextPage ? `http://localhost:8080/api/views/home?page=${result.nextPage}&limit=${limit}&sort=${sort}&query=${query}&categoria=${categoria}` : '';
        result.isValid = !(page <= 0 || page > result.totalPages);

        res.render("home", { result,  user: req.session.user , style: 'index.css' });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos: " + error.message });
    }
});


router.get('/productDetail/:id', async (req, res) => {
    try {
        const { id } = req.params
        const product = await productManager.getProductById(id);
        if (product)
            res.render('productDetail', { product, style: 'index.css' });
        else
            res.status(404).send('Producto no encontrado');
    } catch (error) {
        res.status(404).send('Producto no encontrado');
    }
});

router.get('/chat', (req, res) => {
    res.render('chat', { style: 'index.css' });
});

router.get('/realTimeProducts', isAuthenticated, (req, res) => {
    res.render("realTimeProducts",{  user: req.session.user , style: 'index.css'});
});

router.get('/cart', async (req, res) => {
    try {
        const cid = '6650dacf751e5e5f87b268c7'; // El ID del carrito que quieres mostrar
        const cart = await cartManager.cartFindOne(cid);

        if (!cart || !cart.products || cart.products.length === 0) {
            return res.render('cart', { cartGroupedProducts: [], total: 0, style: 'index.css' });
        }
        const validProducts = cart.products.filter(item => item.product !== null);
        const groupedProducts = validProducts.reduce((acc, item) => {
            const productId = item.product._id.toString();
            if (!acc[productId]) {
                acc[productId] = {
                    title: item.product.title,
                    price: item.product.price,
                    totalQuantity: 0,
                    subtotal: 0,
                    _id: productId // Agregar el _id del producto al objeto
                };
            }
            acc[productId].totalQuantity += item.quantity;
            acc[productId].subtotal = acc[productId].totalQuantity * acc[productId].price;
            return acc;
        }, {});
        const cartGroupedProducts = Object.values(groupedProducts);
        const total = cartGroupedProducts.reduce((acc, item) => acc + item.subtotal, 0);
        res.render('cart', { cartGroupedProducts, total, style: 'index.css' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el carrito');
    }
});

router.get('/restaurar', (req,res)  =>{
    res.render('restaurarContraseña', {style:'index.css'})
})
router.get('/login', isNotAuthenticated, (req, res) => {
    res.render('login', {style: 'index.css'});
});

router.get('/register', isNotAuthenticated, (req, res) => {
    res.render('register', {style: 'index.css'});
});

router.get('/profile', isAuthenticated, (req, res) => {
    res.render('profile', { user: req.session.user });
});

module.exports = router;
