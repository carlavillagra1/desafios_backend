
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
module.exports = { isAuthenticated, isNotAuthenticated };