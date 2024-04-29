const socket = io()
socket.emit('message', "Comunicacion desde web Socket!");
socket.on('individual', data => {console.log(data)});