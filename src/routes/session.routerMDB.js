const express = require("express");
const router = express.Router();
const passport = require("passport");
const userController = require('../controllers/userControllers.js');
const upload = require('../config/multer.js'); 

router.post('/register', passport.authenticate('register', { failureRedirect: 'failregister' }), userController.register);
router.get('/failregister', userController.failRegister);
router.post('/login', passport.authenticate('login', { failureRedirect: 'faillogin' }), userController.login);
router.get('/faillogin', userController.failLogin);
router.post('/logout', userController.logout);
router.post('/changepassword', userController.changePassword);
router.get('/github', passport.authenticate('github', { scope: ['user:email'] }));
router.get('/githubcallback', passport.authenticate('github', { failureRedirect: '/api/views/login' }), userController.githubCallback);
router.put('/premium/:id', userController.changeRoles)
// Rutas de restablecimiento de contraseña
router.post('/reestablecerPassword', userController.requestPasswordReset); // Aquí se enviará el email con el enlace
router.post('/passwordRestablecido', userController.resetPassword); // Endpoint para actualizar la contraseña
// ruta para subir documentos
router.post('/:id/documents', upload.single('document'), userController.uploadDocument);


module.exports = router;
