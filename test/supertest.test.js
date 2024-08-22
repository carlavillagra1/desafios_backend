const dotenv = require('dotenv');
const chai = require('chai');
const supertest = require('supertest');
const mongoose = require('mongoose');
const Product = require('../src/dao/models/product.model.js');
const Cart = require('../src/dao/models/carts.model.js')
const db = require('../src/config/database.js');


dotenv.config();

const expect = chai.expect;
const requester = supertest(process.env.SUPERTEST_URL);

describe('Testing', function () {
    this.timeout(30000);

    before(async function () {
        // Conectar a la base de datos antes de las pruebas
        await mongoose.connect(process.env.MONGODB, {
            serverSelectionTimeoutMS: 30000
        });
    });

    let cookie;

    before(async function () {
        // Realizar el login y obtener la cookie de sesión antes de las pruebas
        const loginResponse = await requester
            .post('/api/session/login')
            .send({ email: 'villgramagali011@gmail.com', password: 'brownie' });
        cookie = loginResponse.headers['set-cookie'];
    });

    describe('Test de productos', () => {
    it('El endpoint POST /api/product debe crear un producto correctamente', async () => {
        const createProductResponse = await requester
            .post('/api/product')
            .send({
                title: 'New Product4',
                description: 'A description of the new product4',
                price: 200,
                thumbnail: 'img3.jpg',
                code: 'NP10014',
                stock: 60,
                category: 'hombre'
            })
            .set('Cookie', cookie);
    
        expect(createProductResponse.status).to.equal(201);
        expect(createProductResponse.body).to.have.property('result', 'success');
        expect(createProductResponse.body.payload).to.include({
            title: 'New Product4',
            description: 'A description of the new product4',
            price: 200,
            stock: 60,
            category: 'hombre'
        });
    
        const productId = createProductResponse.body.payload._id;
        const productInDb = await Product.findById(productId);
    
        expect(productInDb).to.exist;
        expect(productInDb.title).to.equal('New Product4');
        expect(productInDb.price).to.equal(200);
        expect(productInDb.category).to.equal('hombre');
    });
    
    it('El endpoint GET /api/product debe devolver todos los productos correctamente', async () => {
        const getAllProductsResponse = await requester
            .get('/api/product')
            .set('Cookie', cookie);
    
        expect(getAllProductsResponse.status).to.equal(200);
        expect(getAllProductsResponse.body).to.be.an('array');
    });
    
    it('El endpoint GET /api/product/:id debe devolver un producto por su ID', async () => {
        const product = await Product.findOne({ _id: '66c5328f212ef1515696d0ac' });
        const getProductResponse = await requester
            .get(`/api/product/${product._id}`)
            .set('Cookie', cookie);
    
        expect(getProductResponse.status).to.equal(200);
        expect(getProductResponse.body).to.have.property('_id', product._id.toString());
    });
    
    it('El endpoint PUT /api/product/:id debe actualizar un producto', async () => {
        const product = await Product.findOne({ _id: '66c5328f212ef1515696d0ac' });
        const updateProductResponse = await requester
            .put(`/api/product/${product._id}`)
            .send({
                title: 'New Product update',
                description: 'A description of the  product update',
                price: 230,
                thumbnail: 'img3.jpg',
                code: 'NP10014',
                stock: 60,
                category: 'hombre'
            })
            .set('Cookie', cookie);
    
        expect(updateProductResponse.status).to.equal(200);
        expect(updateProductResponse.body).to.have.property('result', 'success');
    
        const updatedProduct = await Product.findById(product._id);
        expect(updatedProduct.title).to.equal('New Product update');
        expect(updatedProduct.price).to.equal(230);
    });
    
    it('El endpoint DELETE /api/product/:id debe eliminar un producto', async () => {
        //Cambiar el id para corregir el test
        const product = await Product.findOne({ _id: '66c6a626432b2f76e6c1e465' }); 
        const deleteProductResponse = await requester
            .delete(`/api/product/${product._id}`)
            .set('Cookie', cookie);
    
        expect(deleteProductResponse.status).to.equal(200);
        expect(deleteProductResponse.body).to.have.property('result', 'success');
    
        const deletedProduct = await Product.findById(product._id);
        expect(deletedProduct).to.be.null;
    });
    
    it('El endpoint GET /api/product/filtrar/:categoria debe filtrar productos por categoría', async () => {
        const filterResponse = await requester
            .get('/api/product/filtrar/hombre')
            .set('Cookie', cookie);
    
        expect(filterResponse.status).to.equal(200);
        expect(filterResponse.body.docs).to.be.an('array');
        filterResponse.body.docs.forEach(product => {
            expect(product.category).to.equal('hombre');
        });
        
    });    
        describe('Test de carts', () => {
            it('El endpoint GET /api/carts/:cid debe obtener un carrito por su ID', async () => {
                const cart = await Cart.findOne({ _id: '66bcdf7f9dc8c8750e732b36' });
                const getCartResponse = await requester
                    .get(`/api/carts/${cart._id}`)
                    .set('Cookie', cookie);
    
                expect(getCartResponse.status).to.equal(200);
                expect(cart._id.toString()).to.equal('66bcdf7f9dc8c8750e732b36');
                expect(getCartResponse.body.products).to.be.an('array');
            });
    
            it('El endpoint POST /api/carts/:cid/product/:id debe añadir un producto al carrito', async () => {
                const cart = await Cart.findOne({ _id: '66bcdf7f9dc8c8750e732b36' });
                const product = await Product.findOne({ _id: '66bfb5315be8f3296cd06d01' });
    
                if (!cart || !product) {
                    throw new Error('Carrito o producto no encontrado en la base de datos');
                }
    
                const addProductResponse = await requester
                    .post(`/api/carts/${cart._id}/product/${product._id}`)
                    .set('Cookie', cookie)
                    .send({ quantity: 2 });
    
                expect(addProductResponse.status).to.equal(200);
                expect(addProductResponse.body).to.have.property('result', 'success');
                expect(addProductResponse.body.cart.products).to.be.an('array');
    
                const expectedProduct = {
                    product: product._id.toString(),
                    quantity: 2
               };
    
                const cartProducts = addProductResponse.body.cart.products;
                const addedProduct = cartProducts.find(p => p.product === product._id.toString());
    
                expect(addedProduct).to.deep.include(expectedProduct);
            });
    
            it('El endpoint DELETE /api/carts/:cid/product/:id debe eliminar un producto del carrito', async () => {
                const cart = await Cart.findOne({ _id: '66bcdf7f9dc8c8750e732b36' });
                //Este no hace falta cambiar el id para corregir si funciona el test
                const product = await Product.findOne({ _id:'66bfb5315be8f3296cd06d01' });
    
                if (!cart || !product) {
                    throw new Error('Carrito o producto no encontrado en la base de datos');
                }
                await requester
                     .post(`/api/carts/${cart._id}/product/${product._id}`)
                    .set('Cookie', cookie)
                    .send({ quantity: 2 });
    
                const removeProductResponse = await requester
                    .delete(`/api/carts/${cart._id}/product/${product._id}`)
                    .set('Cookie', cookie);
    
                expect(removeProductResponse.status).to.equal(200);
                expect(removeProductResponse.body).to.have.property('result', 'success');
    
                const updatedCart = await Cart.findById(cart._id);
                const productInCart = updatedCart.products.find(p => p.product.toString() === product._id.toString());
    
                expect(productInCart).to.be.undefined;
            });
            it('El endpoint DELETE /api/carts/:cid debe eliminar el carrito con dicho id', async () => {
                //Poner otro id para corregir el test
                const cart = await Cart.findOne({ _id:'66c6a71389ba4a0675e50781' });
    
                const removeCartResponse = await requester
                    .delete(`/api/carts/${cart._id}`)
                    .set('Cookie', cookie);
    
                expect(removeCartResponse.status).to.equal(200);
                expect(removeCartResponse.body.message).to.equal('Carrito eliminado con éxito');
    
                const deletedCart = await Cart.findById(cart._id);
                expect(deletedCart).to.be.null; // Verifica que el carrito ya no existe
            });
        })
    
        // Hook que se ejecuta después de todas las pruebas
        after(async function () {
            await mongoose.connection.close();
        });
    });

    });
