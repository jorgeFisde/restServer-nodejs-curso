const mongoose        = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');




let rolesValidos = {
    values: [ 'ADMIN_ROLE', 'USER_ROLE' ],
    message: '{VALUE} No es un rol válido'
}

let Schema = mongoose.Schema;


// CREACION DE LA TABLA DE USUARIO
let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre de usuario es necesario']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El correo de usuario es necesario']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es necesaria']
    },
    img: {
        type: String
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
});

// quitamos la contraseña al momento de desplegar los datos en pantalla  y usamos FUNCTION para poder acceder al "this"
usuarioSchema.methods.toJSON = function () {
    
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;

    return userObject;

}

usuarioSchema.plugin(uniqueValidator, { message: '{PATH} Ya existe el correo electronico' })

module.exports = mongoose.model('Usuario', usuarioSchema);



