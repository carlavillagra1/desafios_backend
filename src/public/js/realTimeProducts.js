const socket = io();
const ListProducts = document.getElementById('productsList');
const mensaje = document.createElement('p');
const btnAgregar = document.getElementById('btnAgregar');

btnAgregar.addEventListener('click', () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;
    const category = document.getElementById('category').value;
    socket.emit('NewProduct', { title, description, price, thumbnail, code, stock, category });
});

socket.on('products', products => {
    ListProducts.innerHTML = ``;
    products.forEach(product => {
        const productContainer = document.createElement('div');
        productContainer.className = 'product';

        const p = document.createElement('p');
        p.innerHTML = `
            <strong>Title: </strong>${product.title},
            <strong>Descripcion: </strong>${product.description},
            <strong>Precio: </strong>${product.price},
            <strong>Codigo: </strong>${product.code},
            <strong>Stock: </strong>${product.stock},
            <strong>categoria: </strong>${product.category}
        `;

        const btnEliminar = document.createElement('button');
        btnEliminar.innerHTML = 'Eliminar';
        btnEliminar.addEventListener('click', () => {
            socket.emit('eliminarProduct', product._id);
        });

        const btnEditar = document.createElement('button');
        btnEditar.innerHTML = 'Editar';
        btnEditar.addEventListener('click', () => {
            const updatedProduct = {
                title: prompt('Nuevo titulo', product.title),
                description: prompt('Nueva descripcion', product.description),
                price: prompt('Nuevo precio', product.price),
                thumbnail: prompt('Nuevo thumbnail', product.thumbnail),
                code: prompt('Nuevo codigo', product.code),
                stock: prompt('Nuevo stock', product.stock),
                category: prompt('Nueva categoria', product.category)
            };

            // Emitir evento para actualizar el producto
            socket.emit('editarProduct', { id: product._id, updatedProduct });
        });

        productContainer.appendChild(p);
        productContainer.appendChild(btnEliminar);
        productContainer.appendChild(btnEditar);

        ListProducts.appendChild(productContainer);
    });
});

socket.on('responseAdd', mensajeResponse => {
    mensaje.innerHTML = `
    <strong>${mensajeResponse} </strong>`;
    ListProducts.appendChild(mensaje);
});

socket.on('responseDelete', mensajeResponse => {
    mensaje.innerHTML = `
    <strong> ${mensajeResponse} </strong>`;
    ListProducts.appendChild(mensaje);
});

socket.on('responseEdit', mensajeResponse => {
    mensaje.innerHTML = `
    <strong> ${mensajeResponse} </strong>`;
    ListProducts.appendChild(mensaje);
});
// Manejo de errores
socket.on('error', error => {
    console.error('Error:', error);
    mensaje.innerHTML = `<strong>Error: ${error.message}</strong>`;
    ListProducts.appendChild(mensaje);
});