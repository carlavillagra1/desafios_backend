const { Server } = require('socket.io');
const MessageRepository = require('../dao/messageRepository.js');
const ProductRepository = require('../dao/productRepository.js');
const messageManager = new MessageRepository();
const productManager = new ProductRepository();
const CustomError = require('../services/errors/CustomError.js');

const initializeSocket = (httpServer) => {
    const io = new Server(httpServer);

    io.on('connection', socket => {
        console.log('Nuevo cliente conectado');

        // Manejo de mensajes
        messageManager.readMessage()
            .then((messages) => {
                socket.emit('messages', messages);
            });
        socket.on('NewMessage', (user, message) => {
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
        socket.on('eliminarMessage', (message) => {
            messageManager.messageDelete(message)
                .then(() => {
                    messageManager.readMessage()
                        .then((messages) => {
                            socket.emit('messages', messages);
                            socket.emit('responseDelete', 'Mensaje eliminado');
                        });
                })
                .catch((error) =>
                    socket.emit('responseDelete', 'Error al eliminar el mensaje: ' + error.message));
        });

        // Manejo de productos
        productManager.readProducts()
            .then((products) => {
                socket.emit('products', products);
            });
        socket.on('NewProduct', (product) => {
            productManager.createProduct(
                product.title, product.description, product.price, product.thumbnail,
                product.code, product.stock, product.category)
                .then(() => {
                    productManager.readProducts()
                        .then((products) => {
                            socket.emit('products', products);
                            socket.emit('responseAdd', 'Producto agregado');
                        });
                })
                .catch((error) => {
                    console.log("error al agregar el poducto", error)
                    if (error instanceof CustomError) {
                        socket.emit('error', { status: 'error', error: error.name, message: error.message, cause: error.cause });
                    } else {
                        socket.emit('error', { status: 'error', message: error.message });
                    }
                });
        });

        socket.on('eliminarProduct', product => {
            productManager.deleteProduct(product)
                .then(() => {
                    productManager.readProducts()
                        .then((products) => {
                            socket.emit('products', products);
                            socket.emit('responseDelete', 'Producto eliminado');
                        });
                })
                .catch((error) =>
                    socket.emit('responseDelete', 'Error al eliminar el producto: ' + error.message));
        });
        socket.on('editarProduct', data => {
            const { id, updatedProduct } = data;
            productManager.updateProduct(id, updatedProduct)
                .then(() => {
                    productManager.readProducts()
                        .then((products) => {
                            socket.emit('products', products);
                            socket.emit('responseEdit', 'Producto actualizado');
                        });
                })
                .catch((error) =>
                    socket.emit('responseEdit', 'Error al actualizar el producto' + error.message));
        });
    });

    return io;
};

module.exports = initializeSocket;
