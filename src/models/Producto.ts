import { Schema,model,Document } from "mongoose";

const schema = new Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    existencia:{
        type: Number,
        required: true,
        trim: true
    },
    precio:{
        type: Number,
        required: true,
        trim: true
    },
    creado:{
        type: Date,
        default: Date.now(),
    },
})
// @ts-nocheck
schema.index({nombre:'text'});

const Producto = model("Producto", schema);

export default Producto;


