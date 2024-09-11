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
    const owner = user._id || user.id;
    socket.emit('NewProduct', { title, description, price, thumbnail, code, stock, category, owner });
});

socket.on('products', products => {
    ListProducts.innerHTML = ``;
    products.forEach(product => {
        // Crear contenedor del producto
        const productContainer = document.createElement('div');
        productContainer.className = 'product';

        // Crear contenedor interno con información del producto
        const contenedorProduct = document.createElement('div');
        contenedorProduct.className = 'contenedorProduct';
        contenedorProduct.innerHTML = `
            <img class="infoFotoCart" src="${product.thumbnail}" alt="${product.title}">
            <strong>Id: </strong>${product._id}
            <strong>Title: </strong>${product.title}
            <strong>Descripcion: </strong>${product.description}
            <strong>Precio: </strong>${product.price}
            <strong>Codigo: </strong>${product.code}
            <strong>Stock: </strong>${product.stock}
            <strong>Categoria: </strong>${product.category}
            <strong>Owner: </strong>${product.owner}
        `;

        // Crear botón Eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.innerHTML = 'Eliminar';
        btnEliminar.classList.add('btnEliminarP');
        btnEliminar.addEventListener('click', () => {
            socket.emit('eliminarProduct', { _id: product._id });
        });
        

        // Crear botón Editar
        const btnEditar = document.createElement('button');
        btnEditar.innerHTML = 'Editar';
        btnEditar.classList.add('btnEliminarP');
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

        // Agregar información del producto y botones al contenedor del producto
        contenedorProduct.appendChild(btnEliminar);
        contenedorProduct.appendChild(btnEditar);
        productContainer.appendChild(contenedorProduct);

        // Agregar el contenedor del producto a la lista de productos
        ListProducts.appendChild(productContainer);
    });
});

socket.on('responseAdd', mensajeResponse => {
    mensaje.innerHTML = `<strong>${mensajeResponse}</strong>`;
    ListProducts.appendChild(mensaje);
});

socket.on('responseDelete', mensajeResponse => {
    mensaje.innerHTML = `<strong>${mensajeResponse}</strong>`;
    ListProducts.appendChild(mensaje);
});

socket.on('responseEdit', mensajeResponse => {
    mensaje.innerHTML = `<strong>${mensajeResponse}</strong>`;
    ListProducts.appendChild(mensaje);
});

// Manejo de errores
socket.on('error', error => {
    console.error('Error:', error);
    mensaje.innerHTML = `<strong>Error: ${error.message}</strong>`;
    ListProducts.appendChild(mensaje);
});
