const passport = require('passport')
const local = require('passport-local')
const User = require('../dao/models/user.model.js')
const { createHash, isValidPassword } = require('../public/js/utils.js')

const localStrategy = local.Strategy

const initializePassport = () =>{
    //estrategias
    passport.use('register', new localStrategy(
        {passReqToCallback: true, usernameField:'email'}, async(req, username,password, done) => {
            const { nombre, apellido, email, age, role} = req.body
            try {
                let user = await User.findOne({email: username})
                if(user){
                    console.log("El usuario ya existe")
                    return done(null, false)
                }
                const newUser = {
                    nombre, 
                    apellido, 
                    email,
                    age,
                    role,
                    password: createHash(password)
                }
                let result =  await User.create(newUser)
                return done(null, result)
            } catch (error) {
                return done("Error al obtener el usuario" + error)
            }
        }
    ))
    passport.serializeUser((user, done) =>{
        done(null, user._id)
    })
    passport.deserializeUser(async(id, done) =>{
        let user = await User.findById(id)
        done(null, user)
    })

    passport.use('login', new localStrategy({usernameField:'email'}, async(username, password, done) =>{
        try {
            const user = await User.findOne({email: username})
            if(!user){
                console.log("El usuario no existe")
                return done(null, user)
            }
            if(!isValidPassword(user, password)) return done(null, false)
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }))
}

module.exports = {initializePassport}