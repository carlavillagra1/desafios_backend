const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require('../controllers/userControllers.js');

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), userController.register);
router.get('/failregister', userController.failRegister);
router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), userController.login);
router.get('/faillogin', userController.failLogin);
router.post('/logout', userController.logout);
router.post('/changepassword', userController.changePassword);
router.get('/github', userController.github);
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/login' }), userController.githubCallback);
router.put('/premiun/:uid', userController.changeRoles)
// Rutas de restablecimiento de contraseña
router.post('/reestablecerPassword', userController.requestPasswordReset); // Aquí se enviará el email con el enlace
router.post('/passwordRestablecido', userController.resetPassword); // Endpoint para actualizar la contraseña


module.exports = router;
