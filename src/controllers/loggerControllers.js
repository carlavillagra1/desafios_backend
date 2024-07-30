const logger = require("../utils/logger.js")

exports.loggerTest = (req,res) =>{

    logger.debug('Prueba de nivel debug');
    logger.http('Prueba de nivel http');
    logger.info('Prueba de nivel info');
    logger.warning('Prueba de nivel warning');
    logger.error('Prueba de nivel error');
    logger.fatal('Prueba de nivel fatal');

    res.send('Verifique los mensajes de prueba');
}