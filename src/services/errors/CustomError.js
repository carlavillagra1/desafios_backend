class CustomError extends Error {
    constructor({name = "Error", cause, message, code = 1}) {
        super(message);
        this.name = name;
        this.code = code;
        this.cause = cause;
    }

    static createError({name = "Error", cause, message, code = 1}) {
        const error = new CustomError({name, cause, message, code});
        console.log('CustomError creado:', error); 
        throw error;
    }
}

module.exports = CustomError;
