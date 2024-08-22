const dotenv = require('dotenv');
const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const db = require('../src/config/database.js');
const User = require('../src/dao/models/user.model.js');
dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.SUPERTEST_URL);


describe('Testing sessions', function () {
    this.timeout(50000);
    let cookie;

    before(async function () {
        // Conectar a la base de datos antes de las pruebas
        await mongoose.connect(process.env.MONGODB, {
            serverSelectionTimeoutMS: 50000
        });

    });
    it('El endpoint POST /api/session/register debe registrar un nuevo usuario', async () => {
        // Asegúrate de que el usuario no existe antes de ejecutar la prueba
        const registerResponse = await requester
        .post('/api/session/register')
        .send({
            nombre: 'Juanita',
            apellido: 'Pereira',
            email: 'juanitapereira1@example.com',
            age: 15,
            password: '123456'
        });

        expect(registerResponse.status).to.equal(201);
        expect(registerResponse.body).to.have.property('status', 'success');
        expect(registerResponse.body).to.have.property('message', 'Usuario registrado');

    })

    it('El endpoint POST /login debe iniciar sesión', async () => {
        const loginResponse = await requester
            .post('/api/session/login')
            .send({
                email: 'villgramagali011@gmail.com',
                password: 'brownie'
            });

        expect(loginResponse.status).to.equal(200);
        expect(loginResponse.body).to.have.property('status', 'success');
        expect(loginResponse.body).to.have.property('redirect').that.equals('/api/views/home');

        cookie = loginResponse.headers['set-cookie'][0];
    });

    // it('El endpoint POST /logout debe cerrar sesión', async () => {
        // const response = await requester
            // .post('/api/session/logout')
            // .set('Cookie', cookie);



        // expect(response.status).to.equal(200);
        // expect(response.body).to.deep.equal({
            // status: "success",
            // message: "Sesión cerrada exitosamente",
            // redirect: '/api/views/login'
        // });
    // });
    it('El endpoint POST /reestablecerPassword debe solicitar restablecimiento de contraseña', async () => {
        const response = await requester
            .post('/api/session/reestablecerPassword')
            .send({ email: 'juan.perez@example.com' });

        expect(response.status).to.equal(200);
        expect(response.text).to.equal('Correo de restablecimiento de contraseña enviado');
    });
    after(async () => {
        // Cerrar la conexión a la base de datos después de las pruebas
        await mongoose.connection.close();
    });
});
