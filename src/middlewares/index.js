
const EErrors = require("../services/errors/enums");

const errorHandler = (error, req, res, next) => {
    console.log(error.cause);
    switch (error.code) {
        case EErrors.INVALID_TYPES_ERROR:
            console.log("Manejando INVALID_TYPES_ERROR");
            res.status(400).send({ status: "error", error: error.name, message: error.message, cause: error.cause });
            break;
            case EErrors.CART_ERROR:
            console.log("Manejando CART_ERROR");
            res.status(400).send({ status: "error", error: error.name, message: error.message, cause: error.cause });
            break;
        default:
            console.log("Error no manejado:", error);
            res.status(500).send({ status: "error", error: "Unhandled error" });
    }
}

module.exports = errorHandler;
