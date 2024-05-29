const mensaje = document.createElement('p') 
const btnEnviar = document.getElementById('btnAgregar')


btnEnviar.addEventListener('click', () =>{
    const user = document.getElementById('user').value
    const message = document.getElementById('message').value
    socket.emit('NewMessage', user, message)
})
socket.on('messages', messages =>{
    messagesList.innerHTML = ``
    messages.forEach(message => {
        const p = document.createElement('p')
        const btnEliminar = document.createElement('button')

        btnEliminar.innerHTML = 'Eliminar'
        btnEliminar.addEventListener('click', () =>{
            socket.emit('eliminarMessage', message._id )
            
        })
        
        p.innerHTML = `
        <strong>Email: </strong>${message.user},
        <strong>Message: </strong>${message.message}
        `
        messagesList.appendChild(p)
        messagesList.appendChild(btnEliminar)
    });
})

socket.on('responseAdd', mensajeResponse=>{
    mensaje.innerHTML = `
    <strong>${mensajeResponse} </strong>`
    messagesList.appendChild(mensaje)

})

socket.on('responseDelete', mensajeResponse =>{
    mensaje.innerHTML =`
    <strong> ${mensajeResponse} </strong>`
    messagesList.appendChild(mensaje)
})