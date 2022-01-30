const mongoose = require("mongoose")

const Usuario = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellidos:{
        type: String,
        required: true,
        trim: true
    },
    email:{
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: true,
        trim: true
    },
    creado:{
        type: Date,
        default: Date.now(),
    },
})

module.exports = mongoose.model("Usuario", Usuario);
