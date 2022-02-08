import { Schema,model } from "mongoose";
import { UsuarioType } from "../types";

const Usuario = model<UsuarioType>("Usuario", new Schema<UsuarioType>({
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