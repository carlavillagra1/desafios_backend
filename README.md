# Rockiando Sport 
###  Proyecto de programacion backend
#### Esta es la entrega del proyecto final.


*_Para inicializar, crear un archivo .env y copiar todo el contenido del archivo .env.example, luego en la terminal escribir el siguiente comando:_*

 `npm start`

Luego de inicializar en la terminal, abrir en chrome y escribir el puerto que estaremos utilizando en el servidor local.


*Lo primero es dirigirte a la siguiente url, ir a registrarte y luego loguearte. O tienes la opcion de loguearte con github.*

` localhost:8080/api/views/login`
 
![](/imgREADME/login.png)

` localhost:8080/api/views/home`

*Si sos usuario premium tenes acceso al panel para subir productos*
![](/imgREADME/homePremium.png)


*En cambio el usuario comun no tiene esa opcion*

![](/imgREADME/home.png)

* Esta es la vista del administrador. El cual tiene acceso a crear, eliminar y modificar cualquier producto que tenga un propietario y que el propietario sea existente actualmente.

| adminCoder@coder.com  admin | Credenciales del administrador

![](/imgREADME/homeAdmin.png)

* En este panel el administrador puede ver todos los usuarios registrados y tiene acceso a eliminar todos los usuarios inactivos por mas de 2 dias y actualizar el rol de cada uno.

![](/imgREADME/listauser.png)


*La vista del perfil tiene la opcion de cambiar de rol a premium o viseversa, el cual solo se puede cambiar si el usuaio tiene mas de 3 documentos, archvios subidos.*

![](/imgREADME/profile.png)


*Esta es la vista del carrrito. El usuario premium no puede agregar su producto al carrito.*
* Al finalizar, se crea un ticket de compra y se envia por email con los detalles de su compra y se vacia el carrito automaticamente.

`localhost:8080/api/views/cart`

![](/imgREADME/cart.png)


