class CustomErrorCart {
    static createError({ name = "CartError", cause, message, code = 4 }) {
        const error = new Error(message, { cause });
        error.name = name;
        error.code = code;
        console.log('CustomErrorCart creado:', error);
        throw error;
    }
}

module.exports = CustomErrorCart;
