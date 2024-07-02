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

module.exports = router;
