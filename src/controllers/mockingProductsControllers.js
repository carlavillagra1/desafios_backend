const { faker } = require('@faker-js/faker');

exports.getMockingProducts = (req, res) => {
    const products = [];

    for (let i = 0; i < 100; i++) {
        const product = {
            id: faker.database.mongodbObjectId(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            image: faker.image.image(),
            stock: faker.random.numeric(1),
            category: faker.commerce.department()
        };
        products.push(product);
    }
    res.json(products);
};
