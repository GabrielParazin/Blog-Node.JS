const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Usuario = new Schema({
    nome:{
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    eAdmin:{
        type: Number,
        default: 0 // 1 é ADMIN
    },
    senha:{
        type: String,
        required: true
    }
})
//Senhas no banco precisa ser criptogradas, ou hasheadas


mongoose.model("usuarios", Usuario)