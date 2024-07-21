class UserDTO {
    constructor(user) {
        this.nombre = user.nombre;
        this.apellido = user.apellido;
        this.email = user.email.replace(/(.{2})(.*)(?=@)/, "$1***"); // Redacta parte del email para mayor seguridad
        this.age = user.age;
    }
}

module.exports = UserDTO;
