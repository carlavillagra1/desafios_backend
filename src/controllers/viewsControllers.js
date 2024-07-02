const cartManagerMongo = require("../dao/cartsManagerMDB.js");
const cartManager = new cartManagerMongo();
const productManagerMongo = require("../dao/productManagerMDB.js");
const productManager = new productManagerMongo();

exports.home = async (req, res) => {
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

        res.render("home", { result, user: req.session.user, style: 'index.css' });
    } catch (error) {
        res.status(500).json({ message: "Error al obtener los productos: " + error.message });
    }
};

exports.productDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const product = await productManager.getProductById(id);
        if (product) res.render("productDetail", { user, product, style: "index.css" });
        else res.status(404).send('Producto no encontrado');
    } catch (error) {
        res.status(404).send('Producto no encontrado');
    }
};

exports.chat = (req, res) => {
    res.render('chat', { style: 'index.css' });
};

exports.realTimeProducts = (req, res) => {
    res.render("realTimeProducts", { user: req.session.user, style: 'index.css' });
};

exports.cart = async (req, res) => {
    try {
        const cartId = req.user.cart;
        const cart = await cartManager.cartFindOne(cartId);
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
                    thumbnail: item.product.thumbnail,
                    totalQuantity: 0,
                    subtotal: 0,
                    _id: productId
                };
            }
            acc[productId].totalQuantity += item.quantity;
            acc[productId].subtotal = acc[productId].totalQuantity * acc[productId].price;
            return acc;
        }, {});
        const cartGroupedProducts = Object.values(groupedProducts);
        const total = cartGroupedProducts.reduce((acc, item) => acc + item.subtotal, 0);
        res.render('cart', { cartGroupedProducts, cartId, total, style: 'index.css' });
    } catch (error) {
        console.error(error);
        res.status(500).send('Error al obtener el carrito');
    }
};

exports.restaurar = (req, res) => {
    res.render('restaurarContraseña', { style: 'index.css' });
};

exports.login = (req, res) => {
    res.render('login', { style: 'index.css' });
};

exports.register = (req, res) => {
    res.render('register', { style: 'index.css' });
};

exports.profile = (req, res) => {
    console.log('Datos de sesión:', req.session.user);
    res.render('profile', { style: 'index.css', user: req.session.user });
};
