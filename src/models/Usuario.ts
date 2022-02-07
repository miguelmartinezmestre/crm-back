import { Schema,model } from "mongoose";

const Usuario = model("Usuario", new Schema({
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
}));

export default Usuario;