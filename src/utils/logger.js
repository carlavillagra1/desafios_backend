const winston = require('winston');
require('dotenv').config(); 


// Definir niveles de log personalizados
const customLevels = {
    levels: {
        debug: 0,
        http: 1,
        info: 2,
        warning: 3,
        error: 4,
        fatal: 5,
    },
    colors: {
        debug: 'cyan',
        http: 'blue',
        info: 'green',
        warning: 'yellow',
        error: 'orange',
        fatal: 'red',
    },
};

// Crear logger para desarrollo
const devLogger = winston.createLogger({
    levels: customLevels.levels,
    transports: [
        new winston.transports.Console({ 
            level: 'debug',
            format: winston.format.combine(
                winston.format.timestamp(),
                winston.format.colorize({colors: customLevels.colors}),
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
            level: 'info', // Mostrar info y niveles superiores en consola
            format: winston.format.combine(
                winston.format.colorize(),
                winston.format.simple()
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
console.log('Logger en uso:', process.env.NODE_ENV === 'production' ? 'Producción' : 'Desarrollo');

module.exports = logger;
