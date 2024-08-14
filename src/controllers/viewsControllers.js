const cartManagerMongo = require("../dao/cartsRepository.js");
const cartManager = new cartManagerMongo();
const productManagerMongo = require("../dao/productRepository.js");
const productManager = new productManagerMongo();
const TicketService = require("../services/ticketService.js");
const ticketService = new  TicketService()
const UserDTO = require("../dao/dto/userDTO.js")
const logger = require('../utils/logger.js')

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
        logger.error('Error al obtener los productos' + error.message)
        res.status(500).json({ message: "Error al obtener los productos: " + error.message });
    }
};

exports.productDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const user = req.user;
        const product = await productManager.getProductById(id);
        if (!product) {
            logger.warning('Producto no encontrado', { id });
            return res.status(404).send('Producto no encontrado');
        }
        res.render("productDetail", { user, product, style: "index.css" });
    } catch (error) {
        logger.error('Error al obtener el producto' + error.message)
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
        if (!req.user || !req.user.cart) {
            logger.warning('Intento de acceso al carrito sin autenticación', { user: req.user });
            return res.status(401).send('Autenticación requerida para ver el carrito');
        }
        if (!cart || !cart.products || cart.products.length === 0) {
            logger.warning('El carrito está vacío', { cartId });
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
        logger.error('Error al obtener el carrito' + error.message)
        res.status(500).send('Error al obtener el carrito');
    }
};
exports.renderTicket = async (req, res, next) => {
    try {
        const { ticketId } = req.params;
        const ticket = await ticketService.getTicketById(ticketId);
        res.render('ticket', { title: 'Detalles del Ticket', ticket, style: 'index.css' });
    } catch (error) {
        logger.error('Error al obtener el ticket' + error.message)
        next(new Error("Error al obtener el ticket: " + error.message));
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
    const user = new UserDTO(req.session.user);
    console.log('Datos de sesión:', req.session.user);
    res.render('profile', { style: 'index.css', user });
};

// Vista para solicitar el restablecimiento de contraseña
exports.requestPasswordReset = (req, res) => {
    res.render('ReestablecerPorLink', { style: 'index.css' });
};

// Vista para restablecer la contraseña usando el token
exports.resetPassword = (req, res) => {
    const { token } = req.query;
    res.render('ReestablecerContraseñaJWT', { token, style: 'index.css' });
};

// Vista para el caso en que el enlace ha expirado
exports.resetLinkExpired = (req, res) => {
    res.render('ResetLinkExpired', { style: 'index.css' });
};