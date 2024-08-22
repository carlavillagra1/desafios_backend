const session = require('express-session');
const MongoStore = require('connect-mongo');
const { Server } = require('socket.io');
const MessageRepository = require('../dao/messageRepository.js');
const ProductRepository = require('../dao/productRepository.js');
const messageManager = new MessageRepository();
const productManager = new ProductRepository();
const CustomError = require('../services/errors/CustomError.js');

// Configura el middleware de sesión
const sessionMiddleware = session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
});

const initializeSocket = (httpServer) => {
    const io = new Server(httpServer);

    io.use((socket, next) => {
        sessionMiddleware(socket.request, {}, next);
    });

    io.on('connection', socket => {
        console.log('Nuevo cliente conectado');
        const user = socket.request.session.user;
        if (!user) {
            console.error('Usuario no autenticado en socket connection');
            socket.emit('error', { status: 'error', message: 'Usuario no autenticado' });
            return;
        }
        console.log('Usuario autenticado:', user); // Verificar si la información del usuario está disponible
        // Manejo de mensajes
        messageManager.readMessage()
            .then((messages) => {
                socket.emit('messages', messages);
            });
        socket.on('NewMessage', (message) => {
            if (!user) {
                socket.emit('error', { status: 'error', message: 'Usuario no autenticado' });
                return;
            }

            messageManager.createMessage(user, message)
                .then(() => {
                    messageManager.readMessage()
                        .then((messages) => {
                            socket.emit('messages', messages);
                            socket.emit('responseAdd', 'Mensaje enviado');
                        });
                })
                .catch((error) =>
                    socket.emit('responseAdd', 'Error al enviar el mensaje: ' + error.message));
        });

        // Manejo de productos
        productManager.readProducts()
            .then((products) => {
                socket.emit('products', products);
            });
        socket.on('NewProduct', (product) => {
            if (!user) {
                socket.emit('error', { status: 'error', message: 'Usuario no autenticado' });
                return;
            }

            productManager.createProduct(
                product.title, product.description, product.price, product.thumbnail,
                product.code, product.stock, product.category, user)
                .then(() => {
                    productManager.readProducts()
                        .then((products) => {
                            socket.emit('products', products);
                            socket.emit('responseAdd', 'Producto agregado');
                        });
                })
                .catch((error) => {
                    console.log("error al agregar el producto", error)
                    if (error instanceof CustomError) {
                        socket.emit('error', { status: 'error', error: error.name, message: error.message, cause: error.cause });
                    } else {
                        socket.emit('error', { status: 'error', message: error.message });
                    }
                });
        });

        socket.on('eliminarProduct', (product) => {
            const userId = socket.request.session.user._id || socket.request.session.user.id; // Obtener el ID del usuario
            const userRole = socket.request.session.user.role; // Obtener el rol del usuario
            if (!userId) {
                socket.emit('error', { status: 'error', message: 'Usuario no autenticado' });
                return;
            }
        if (!product._id) {
            throw new Error('ID del producto no proporcionado');
        }

            productManager.deleteProduct(product._id, userId, userRole)
                .then(() => {
                    return productManager.readProducts();
                })
                .then((products) => {
                    socket.emit('products', products);
                    socket.emit('responseDelete', 'Producto eliminado');
                })
                .catch((error) => {
                    socket.emit('responseDelete', 'Error al eliminar el producto: ' + error.message);
                });
        });
        
        socket.on('editarProduct', (data) => {
            const { id, updatedProduct } = data;
            if (!user) {
                socket.emit('error', { status: 'error', message: 'Usuario no autenticado' });
                return;
            }

            productManager.updateProduct(id, updatedProduct)
                .then(() => {
                    productManager.readProducts()
                        .then((products) => {
                            socket.emit('products', products);
                            socket.emit('responseEdit', 'Producto actualizado');
                        });
                })
                .catch((error) =>
                    socket.emit('responseEdit', 'Error al actualizar el producto: ' + error.message));
        });
    });

    return io;
};

module.exports = initializeSocket;
