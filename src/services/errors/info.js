const generateProductErrorInfo = (product) => {
    return `Hay un problema con el producto  
    Propiedades requeridas: 
    title: necesita ser un string y se recibio "${product.title}"
    description: necesita ser un string y se recibio "${product.description}"
    price:  necesita ser un numero y se recibio "${product.price}"
    thumbnail: necesita ser un string y se recibio "${product.thumbnail}"
    code: necesita ser un id y se recibio "${product.code}"
    stock: necesita ser un numero  y se recibio "${product.stock}"
    categoria: necesita ser un string y se recibio "${product.category}"
    `

}
const generateCartErrorInfo = (cart, product) => {
    return `Hay un problema con el carrito
    Carrito ID: ${cart.cid}
    Producto ID: ${product.id}`;
}


module.exports = { generateProductErrorInfo , generateCartErrorInfo};

