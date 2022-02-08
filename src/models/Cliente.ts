import { Schema,model } from "mongoose";
import { ClienteType } from "../types";

const Cliente = model<ClienteType>("Cliente", new Schema<ClienteType>({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    apellido:{
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
    empresa:{
        type: String,
        required: true,
        trim: true
    },
    telefono:{
        type: String,
        required: true,
        trim: true
    },
    creado:{
        type: Date,
        default: Date.now(),
    },
    vendedor:{
        type: Schema.Types.ObjectId,
        required:true,
        ref: 'Usuario'
    }
}));

export default Cliente;