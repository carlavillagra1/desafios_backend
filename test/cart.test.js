// const dotenv = require('dotenv');
// const chai = require('chai');
// const supertest = require('supertest');
// const mongoose = require('mongoose');
// const Product = require('../src/dao/models/product.model.js');
// const Cart = require('../src/dao/models/carts.model.js')

// dotenv.config();

// const expect = chai.expect;
// const requester = supertest(process.env.SUPERTEST_URL);

// describe('Testing cart', function () {
//     this.timeout(30000);
//     let cookie;

//     before(async function () {
//         // Conectar a la base de datos y realizar login antes de las pruebas
//         await mongoose.connect(process.env.MONGODB, {
//             serverSelectionTimeoutMS: 30000
//         });

//         const loginResponse = await requester
//             .post('/api/session/login')
//             .send({ email: 'villgramagali011@gmail.com', password: 'brownie' });
//         expect(loginResponse.status).to.equal(302);
//         cookie = loginResponse.headers['set-cookie'][0];
//     });

//     // Pruebas de productos aquí...
//     it('El endpoint GET /api/carts/:cid debe obtener un carrito por su ID', async () => {
//         const cart = await Cart.findOne({ _id: '66bcdf7f9dc8c8750e732b36' });
//         const getCartResponse = await requester
//             .get(`/api/carts/${cart._id}`)
//             .set('Cookie', cookie);

//         expect(getCartResponse.status).to.equal(200);
//         expect(cart._id.toString()).to.equal('66bcdf7f9dc8c8750e732b36');
//         expect(getCartResponse.body.products).to.be.an('array');
//     });

//     it('El endpoint POST /api/carts/:cid/product/:id debe añadir un producto al carrito', async () => {
//         const cart = await Cart.findOne({ _id: '66bcdf7f9dc8c8750e732b36' });
//         const product = await Product.findOne({ _id: '66bfb5315be8f3296cd06d01' });

//         if (!cart || !product) {
//             throw new Error('Carrito o producto no encontrado en la base de datos');
//         }

//         const addProductResponse = await requester
//             .post(`/api/carts/${cart._id}/product/${product._id}`)
//             .set('Cookie', cookie)
//             .send({ quantity: 2 });

//         expect(addProductResponse.status).to.equal(200);
//         expect(addProductResponse.body).to.have.property('result', 'success');
//         expect(addProductResponse.body.cart.products).to.be.an('array');

//         const expectedProduct = {
//             product: product._id.toString(),
//             quantity: 2
//         };

//         const cartProducts = addProductResponse.body.cart.products;
//         const addedProduct = cartProducts.find(p => p.product === product._id.toString());

//         expect(addedProduct).to.deep.include(expectedProduct);
//     });

//     // it('El endpoint DELETE /api/carts/:cid/product/:id debe eliminar un producto del carrito', async () => {
//     //     const cart = await Cart.findOne({ _id: '66bcdf7f9dc8c8750e732b36' });
//     //     const product = await Product.findOne({ _id: '66bfb4f05be8f3296cd06cfd' });

//     //     if (!cart || !product) {
//     //         throw new Error('Carrito o producto no encontrado en la base de datos');
//     //     }
//     //     await requester
//     //         .post(`/api/carts/${cart._id}/product/${product._id}`)
//     //         .set('Cookie', cookie)
//     //         .send({ quantity: 2 });

//     //     const removeProductResponse = await requester
//     //         .delete(`/api/carts/${cart._id}/product/${product._id}`)
//     //         .set('Cookie', cookie);

//     //     expect(removeProductResponse.status).to.equal(200);
//     //     expect(removeProductResponse.body).to.have.property('result', 'success');

//     //     const updatedCart = await Cart.findById(cart._id);
//     //     const productInCart = updatedCart.products.find(p => p.product.toString() === product._id.toString());

//     //     expect(productInCart).to.be.undefined;
//     // });
//     // it('El endpoint DELETE /api/carts/:cid debe eliminar el carrito con dicho id', async () => {
//     //     const cart = await Cart.findOne({ _id: '6683337f8d0a11afa65f7edf' });

//     //     const removeCartResponse = await requester
//     //         .delete(`/api/carts/${cart._id}`)
//     //         .set('Cookie', cookie);

//     //     // Verifica que la eliminación fue exitosa
//     //     expect(removeCartResponse.status).to.equal(200);
//     //     expect(removeCartResponse.body.message).to.equal('Carrito eliminado con éxito');

//     //     const deletedCart = await Cart.findById(cart._id);
//     //     expect(deletedCart).to.be.null; // Verifica que el carrito ya no existe
//     // });

//     after(async function () {
//         await mongoose.connection.close();
//     });
// });
