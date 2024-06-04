const express = require('express');
const app = express();
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const productRouterMDB = require('./routes/product.routerMDB.js');
const messageRouterMDB = require('./routes/message.routerMDB.js');
const cartsRouterMDB = require('./routes/carts.routerMDB.js');
const sessionRouter = require('./routes/session.routerMDB.js')
const viewRouter = require('./routes/views.router.js');
const db = require('./config/database.js')
const productManagerMongo = require('./dao/productManagerMDB.js');
const productManager = new productManagerMongo();
const messageMongo = require('./dao/messageManagerMDB.js');
const messageManager = new messageMongo();
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')
const dotenv = require('dotenv');
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const Server = require('socket.io');
const port = 8080;
dotenv.config()

const httpServer = app.listen(port, console.log(`Server running on port ${port}`));
const socketServer = Server(httpServer);

const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
    // cookie: { maxAge: 180 * 60 * 1000 } // 3 horas
}));

initializePassport()
app.use(passport.initialize())
app.use(passport.session())

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/api/product', productRouterMDB);
app.use('/api/message', messageRouterMDB);
app.use('/api/carts', cartsRouterMDB);
app.use('/api/views', viewRouter);
app.use('/api/session', sessionRouter);




socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

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
                socket.emit('responseAdd', 'Error al enviar el mensaje' + error.message));
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
                socket.emit('responseDelete', 'Error al eliminar el mensaje' + error.message));
    });
});

socketServer.on('connection', socket => {
    console.log('Nuevo cliente conectado');

    productManager.readProducts()
        .then((products) => {
            socket.emit('products', products);
        });
    socket.on('NewProduct', (product) => {
        console.log(product);
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
            .catch((error) =>
                socket.emit('responseAdd', 'Error al agregar el producto' + error.message));
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
                socket.emit('responseDelete', 'Error al eliminar el producto' + error.message));
    });
});
