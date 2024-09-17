const session = require('express-session');
const MongoStore = require('connect-mongo');
const { Server } = require('socket.io');
const MessageRepository = require('../dao/messageRepository.js');
const ProductRepository = require('../dao/productRepository.js');
const messageManager = new MessageRepository();
const productManager = new ProductRepository();
const CustomError = require('../services/errors/CustomError.js');
const { sendProductDeletionEmail } = require('../public/js/emailProductEliminado.js');
const User = require('../dao/models/user.model.js');

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
                .catch((error) => {
                    console.error("Error al enviar el mensaje:", error.message);
                    socket.emit('responseAdd', 'Error al enviar el mensaje: ' + error.message);
                });
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
                    console.error("Error al agregar el producto:", error.message);
                    if (error instanceof CustomError) {
                        socket.emit('error', { status: 'error', error: error.name, message: error.message, cause: error.cause });
                    } else {
                        socket.emit('error', { status: 'error', message: error.message });
                    }
                });
        });

        socket.on('eliminarProduct', async (product) => {
            try {
                const userId = socket.request.session.user._id || socket.request.session.user.id;
                const userRole = socket.request.session.user.role;

                if (!userId) {
                    socket.emit('error', { status: 'error', message: 'Usuario no autenticado' });
                    return;
                }

                if (!product._id) {
                    throw new Error('ID del producto no proporcionado');
                }

                // Verifica si el producto existe y si el usuario tiene permiso para eliminarlo
                const productToDelete = await productManager.getProductById(product._id);
                if (!productToDelete) {
                    throw new Error('El producto no pudo ser encontrado');
                }

                if (userRole !== 'admin' && productToDelete.owner.toString() !== userId) {
                    throw new Error('No tienes permiso para eliminar este producto');
                }

                // Eliminar el producto
                const deleteResult = await productManager.deleteProduct(product._id, userId, userRole);
                if (deleteResult.deletedCount === 0) {
                    throw new Error('El producto no pudo ser eliminado');
                }

                // Obtiene el dueño del producto antes de eliminar
                const owner = await User.findById(productToDelete.owner);
                if (owner && owner.role === 'premium') {
                    const ownerEmail = owner.email;
                    const ownerName = owner.nombre;
                    await sendProductDeletionEmail(ownerEmail, ownerName, product._id);
                }

                // Actualiza la lista de productos
                const products = await productManager.readProducts();
                socket.emit('products', products);
                socket.emit('responseDelete', 'Producto eliminado y notificado por correo.');
            } catch (error) {
                console.error('Error al eliminar el producto:', error.message);
                socket.emit('responseDelete', 'Error al eliminar el producto: ' + error.message);
            }
        });

        socket.on('editarProduct', (data) => {
            const { id, updatedProduct } = data;
            if (!user) {
                socket.emit('error', { status: 'error', message: 'Usuario no autenticado' });
                return;
            }

            // Verifica que el usuario sea dueño del producto o admin
            productManager.getProductById(id)
                .then((existingProduct) => {
                    if (!existingProduct) {
                        throw new Error('Producto no encontrado');
                    }
                    if (user.role !== 'admin' && existingProduct.owner.toString() !== user._id) {
                        throw new Error('No tienes permiso para editar este producto');
                    }
                    return productManager.updateProduct(id, updatedProduct);
                })
                .then(() => {
                    productManager.readProducts()
                        .then((products) => {
                            socket.emit('products', products);
                            socket.emit('responseEdit', 'Producto actualizado');
                        });
                })
                .catch((error) => {
                    console.error('Error al actualizar el producto:', error.message);
                    socket.emit('responseEdit', 'Error al actualizar el producto: ' + error.message);
                });
        });
    });

    return io;
};

module.exports = initializeSocket;
