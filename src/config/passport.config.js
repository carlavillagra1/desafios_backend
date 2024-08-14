const passport = require('passport')
const local = require('passport-local')
const githubStrategy = require('passport-github2')
const User = require('../dao/models/user.model.js')
const logger = require('../utils/logger.js')
const dotenv = require('dotenv');
dotenv.config()

const localStrategy = local.Strategy

const initializePassport = () => {
    //estrategias
    passport.use('github', new githubStrategy({
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        callbackURL: process.env.CALLBACK_URL
    }, async (accessToken, refreshToken, profile, done) => {
        try {
            console.log(profile)
            let user = await User.findOne({ email: profile._json.email })
            if (!user) {
                let newUser = {
                    nombre: profile._json.name.split(' ')[0], // Assuming first part of name
                    apellido: profile._json.name.split(' ').slice(1).join(' ') || "N/A", // Rest as apellido or "N/A"
                    email: profile._json.email,
                    age: 89,
                    password: "12345",
                    rol: "user"
                }
                let result = await User.create(newUser)
                done(null, result)
            }
            else {
                done(null, user)
            }
        } catch (error) {
            logger.error('Error al ingresar con github' + error.message)
            done(error)
        }

    }
    ))

    passport.use('register', new localStrategy(
        { passReqToCallback: true, usernameField: 'email' }, async (req, username, password, done) => {
            const { nombre, apellido, email, age, role } = req.body
            try {
                let user = await User.findOne({ email: username })
                if (user) {
                    logger.warning("El usuario ya existe")
                    return done(null, false)
                }
                const newUser = {
                    nombre,
                    apellido,
                    email,
                    age,
                    role,
                    password
                };
                let result = await User.create(newUser)
                return done(null, result)
            } catch (error) {
                logger.error('Error al obtener el usuario' + error.message)
                return done("Error al obtener el usuario" + error)
            }
        }
        ))
        passport.use('login', new localStrategy({usernameField:'email'}, async(username, password, done) =>{
            try {
                const user = await User.findOne({email: username})
                if(!user){
                    logger.warning("El usuario no existe")
                    return done(null, user)
                }
        const isMatch = await user.comparePassword(password);
        console.log('¿Las contraseñas coinciden?', isMatch);
        if (!isMatch) {
            return done(null, false);
        }
                return done(null, user)
            } catch (error) {
                return done(error)
            }
        }))
    passport.serializeUser((user, done) => {
        done(null, user._id)
    })
    passport.deserializeUser(async (id, done) => {
        let user = await User.findById(id)
        done(null, user)
    })

}
    


module.exports = { initializePassport }