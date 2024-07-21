
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        res.redirect('/api/views/login');
    }
};

const isNotAuthenticated = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        res.redirect('/api/views/profile');
    }
}
// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.redirect('/api/views/realTimeProducts'); // O cualquier otra ruta de redirección para usuarios no autorizados
    }
};
// Middleware para verificar si el usuario es un usuario normal
const isUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    } else {
        res.redirect('/api/views/home'); // O cualquier otra ruta de redirección para usuarios no autorizados
    }
};

module.exports = { isAuthenticated, isNotAuthenticated, isAdmin, isUser };