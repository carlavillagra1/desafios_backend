const winston = require('winston');
require('dotenv').config(); 


// Definir niveles de log personalizados
const customLevels = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5,
    },
    colors: {
        fatal: 'white',
        error: 'red',
        warning: 'yellow',
        info: 'blue',
        http: 'green',
        debug: 'magenta',
    },
};
winston.addColors(customLevels.colors)

// Crear logger para desarrollo
const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
                ),
            })
        ]
});

// Crear logger para producción
const prodLogger = winston.createLogger({
    levels: customLevels.levels,
    format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.json()
    ),
    transports: [
        new winston.transports.Console({
            level: 'info', 
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.printf(({ timestamp, level, message }) => {
                    return `${timestamp} [${level}]: ${message}`;
                })
            )
        }),
        new winston.transports.File({
            filename: 'errors.log',
            level: 'error', // Solo errores en el archivo
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.json()
            )
        })
    ]
});


// Seleccionar el logger basado en el entorno
const logger = process.env.NODE_ENV === 'production' ? prodLogger : devLogger;


module.exports = logger;
