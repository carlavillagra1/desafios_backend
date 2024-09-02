const moment = require('moment')
class UserDTO {
    constructor(user) {
        this._id = user._id || user.id;
        this.nombre = user.nombre;
        this.apellido = user.apellido;
        // Redacta parte del email para mayor seguridad
        this.email = user.email.replace(/(.{2})(.*)(?=@)/, "$1***");
        this.age = user.age;
        this.role = user.role; 
         // Formatear la fecha de last_connection
        this.last_connection = user.last_connection ? moment(user.last_connection).format('YYYY-MM-DD HH:mm:ss') : null;
        }
}

module.exports = UserDTO;
