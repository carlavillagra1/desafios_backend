const express = require('express');
const app = express();
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars'); // Importa Handlebars para registrar el helper
const productRouterMDB = require('./routes/product.routerMDB.js');
const messageRouterMDB = require('./routes/message.routerMDB.js');
const cartsRouterMDB = require('./routes/carts.routerMDB.js');
const sessionRouter = require('./routes/session.routerMDB.js')
const viewRouter = require('./routes/views.router.js');
const ticketRouter = require('./routes/ticket.routerMDB.js')
const mockingRouter = require("./routes/mocking.router.js")
const loggerRouter = require('./routes/loggerTest.router.js')
const db = require('./config/database.js')
const passport = require('passport')
const { initializePassport } = require('./config/passport.config.js')
const dotenv = require('dotenv');
const  { faker } = require("@faker-js/faker")
const path = require('path')
const session = require('express-session')
const MongoStore = require('connect-mongo')
const Server = require('socket.io');
const initializeSocket = require('./config/socket.js'); 
const errorHandler = require('./middlewares/index.js')
const logger = require('./utils/logger.js')
const swaggerUiExpress = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const port = 8080;
dotenv.config()

const httpServer = app.listen(port, console.log(`Server running on port ${port}`));
// Inicializar sockets
initializeSocket(httpServer);

const hbs = handlebars.create({

    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});
// Registrar el helper `eq`
Handlebars.registerHelper('eq', function (a, b) {
    return a === b;
});


initializePassport()

app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
    // cookie: { maxAge: 180 * 60 * 1000 } // 3 horas
}));
const swaggerOptions = {
    definition:{
        openapi:'3.0.1',
        info:{
            title:"Documentacion",
            description:"Api clase swagger",
        },
    },
    apis:[`src/docs/**/*.yaml`],
}
const specs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs))

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
app.use('/api/tickets', ticketRouter);
app.use('/api/mocking', mockingRouter)
app.use('/api/logger', loggerRouter)

app.use(errorHandler)

console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log(`Entorno actual: ${process.env.NODE_ENV}`);

