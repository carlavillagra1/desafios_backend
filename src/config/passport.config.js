const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const GitHubStrategy = require('passport-github2').Strategy;
const User = require('../dao/models/user.model.js');
const logger = require('../utils/logger.js');
const dotenv = require('dotenv');
dotenv.config();

const initializePassport = () => {
    // Estrategia de GitHub
    passport.use('github', new GitHubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            logger.info('Perfil de GitHub:', profile);
            
            let email = profile._json.email;
            
            if (!email) {
                logger.warning('El perfil de GitHub no tiene un email público.');
                return done(null, false, { message: 'El perfil de GitHub no tiene un email público.' });
            }
            
            let user = await User.findOne({ email });
            if (!user) {
                let newUser = {
                    nombre: profile._json.name ? profile._json.name.split(' ')[0] : 'Usuario', 
                    apellido: profile._json.name ? profile._json.name.split(' ').slice(1).join(' ') : "N/A",
                    email,
                    age: 89,
                    password: "12345",
                    rol: "user"
                };
                let result = await User.create(newUser);
                return done(null, result);
            } else {
                return done(null, user);
            }
        } catch (error) {
            logger.error('Error al ingresar con GitHub: ' + error.message);
            return done(error);
        }
    }));

    // Estrategia de registro
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email' }, 
        async (req, username, password, done) => {
            const { nombre, apellido, email, age, role } = req.body;
            try {
                let user = await User.findOne({ email: username });
                if (user) {
                    logger.warning("El usuario ya existe");
                    return done(null, false, { message: 'El usuario ya existe' });
                }
                
                const newUser = {
                    nombre,
                    apellido,
                    email,
                    age,
                    role,
                    password
                };

                let result = await User.create(newUser);
                return done(null, result);
            } catch (error) {
                logger.error('Error al registrar el usuario: ' + error.message);
                return done(error);
            }
        }
    ));

    // Estrategia de login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email' }, 
        async (username, password, done) => {
            try {
                const user = await User.findOne({ email: username });
                if (!user) {
                    logger.warning("El usuario no existe");
                    return done(null, false, { message: 'El usuario no existe' });
                }

                const isMatch = await user.comparePassword(password);
                logger.info('¿Las contraseñas coinciden?', isMatch);
                if (!isMatch) {
                    return done(null, false, { message: 'Contraseña incorrecta' });
                }

                return done(null, user);
            } catch (error) {
                logger.error('Error en la autenticación de usuario: ' + error.message);
                return done(error);
            }
        }
    ));

    // Serialización de usuarios
    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const user = await User.findById(id);
            done(null, user);
        } catch (error) {
            logger.error('Error al deserializar el usuario: ' + error.message);
            done(error);
        }
    });
};

module.exports = { initializePassport };
