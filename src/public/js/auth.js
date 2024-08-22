const isAuthenticated = (req, res, next) => {
    if (req.session.user && (req.session.user._id || req.session.user.id)) {
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
};
function getUserOwner(req) {
    return req.user.email || req.user._id; 
}
4
// Middleware para verificar si el usuario es administrador
const isAdmin = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'admin') {
        return next();
    } else {
        res.redirect('/api/views/realTimeProducts');
    }
};

// Middleware para verificar si el usuario es un usuario regular
const isRegularUser = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'user') {
        return next();
    } else {
        res.redirect('/api/views/home');
    }
};

// Middleware para verificar si el usuario tiene rol 'premium'
const isPremium = (req, res, next) => {
    if (req.session.user && req.session.user.role === 'premium') {
        return next();
    } else {
        res.redirect('/api/views/home');
    }
};

// Middleware para verificar si el usuario es 'user' o 'premium'
const isUserOrPremium = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'user' || req.session.user.role === 'premium')) {
        return next();
    } else {
        res.redirect('/api/views/home');
    }
};
// Middleware para verificar si el usuario es 'admin' o 'premium'
const isAdminOrPremium = (req, res, next) => {
    if (req.session.user && (req.session.user.role === 'admin' || req.session.user.role === 'premium')) {
        return next();
    } else {
        res.redirect('/api/views/home');
    }
};
module.exports = { 
    isAuthenticated, 
    isNotAuthenticated, 
    isAdmin, 
    isRegularUser, 
    isPremium, 
    isUserOrPremium ,
    isAdminOrPremium,
    getUserOwner
};
