const socket = io()
const ListProducts = document.getElementById('productsList')
const mensaje = document.createElement('p') 
const btnAgregar = document.getElementById('btnAgregar')


btnAgregar.addEventListener('click', () =>{
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const price = document.getElementById('price').value
    const thumbnail = document.getElementById('thumbnail').value
    const code = document.getElementById('code').value
    const stock = document.getElementById('stock').value
    const category  = document.getElementById('category').value
    socket.emit('NewProduct', {title, description, price, thumbnail, code, stock, category})
})
socket.on('products', products =>{
    ListProducts.innerHTML = ``
    products.forEach(product => {
        const p = document.createElement('p')
        const btnEliminar = document.createElement('button')

        btnEliminar.innerHTML = 'Eliminar'
        btnEliminar.addEventListener('click', () =>{
            socket.emit('eliminarProduct', product._id)
        })
        
        p.innerHTML = `
        <strong>Title: </strong>${product.title},
        <strong>Descripcion: </strong>${product.description},
        <strong>Precio: </strong>${product.price},
        <strong>Codigo: </strong>${product.code},
        <strong>Stock: </strong>${product.stock},
        <strong>categoria: </strong>${product.category}
        `
        ListProducts.appendChild(p)
        ListProducts.appendChild(btnEliminar)
    });
})

socket.on('responseAdd', mensajeResponse=>{
    mensaje.innerHTML = `
    <strong>${mensajeResponse} </strong>`
    ListProducts.appendChild(mensaje)

})

socket.on('responseDelete', mensajeResponse =>{
    mensaje.innerHTML =`
    <strong> ${mensajeResponse} </strong>`
    ListProducts.appendChild(mensaje)
})