const express = require('express');
const app = express();
const mongoose = require('mongoose');
const handlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const dotenv = require('dotenv');
const swaggerUiExpress = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const passport = require('passport');
const { initializePassport } = require('./config/passport.config.js');
const initializeSocket = require('./config/socket.js');
const errorHandler = require('./middlewares/index.js');
const logger = require('./utils/logger.js');

// Configuración del entorno
dotenv.config();

// Configuración de la base de datos
const db = require('./config/database.js');

// Importar Routers
const productRouterMDB = require('./routes/product.routerMDB.js');
const messageRouterMDB = require('./routes/message.routerMDB.js');
const cartsRouterMDB = require('./routes/carts.routerMDB.js');
const sessionRouter = require('./routes/session.routerMDB.js');
const viewRouter = require('./routes/views.router.js');
const ticketRouter = require('./routes/ticket.routerMDB.js');
const mockingRouter = require('./routes/mocking.router.js');
const loggerRouter = require('./routes/loggerTest.router.js');

// Configuración de servidor
const port = 8080;
const httpServer = app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

// Inicializar sockets
initializeSocket(httpServer);

// Configuración de Handlebars
const hbs = handlebars.create({
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    }
});

// Registrar los helpers de Handlebars
Handlebars.registerHelper('eq', (a, b) => a === b);
Handlebars.registerHelper('json', context => JSON.stringify(context));

// Inicializar Passport
initializePassport();

// Configuración de sesión
app.use(session({
    secret: 'secretkey',
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB }),
}));

// Middleware para archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Configuración de Swagger
const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info: {
            title: "Documentacion",
            description: "Api clase swagger",
        },
    },
    apis: [`src/docs/**/*.yaml`],
};
const specs = swaggerJsDoc(swaggerOptions);
app.use("/api/docs", swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

// Inicializar Passport
app.use(passport.initialize());
app.use(passport.session());

// Configuración del motor de plantillas
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middleware de análisis de solicitudes
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Configuración de rutas
app.use('/api/product', productRouterMDB);
app.use('/api/message', messageRouterMDB);
app.use('/api/carts', cartsRouterMDB);
app.use('/api/views', viewRouter);
app.use('/api/session', sessionRouter);
app.use('/api/tickets', ticketRouter);
app.use('/api/mocking', mockingRouter);
app.use('/api/logger', loggerRouter);

// Middleware de manejo de errores
app.use(errorHandler);

console.log(`Entorno actual: ${process.env.NODE_ENV}`);
