import { Schema,model } from "mongoose";
import { PedidoType } from "../types";

const Pedido = model<PedidoType>("Pedido", new Schema<PedidoType>({
    pedido:{
        type: Array,
        required: true,
    },
    total:{
        type: Number,
        required: true,
    },
    cliente:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'Cliente'
    },
    vendedor:{
        type: Schema.Types.ObjectId,
        required: true,
        ref:'Usuario'
    },
    estado:{
        type: String,
        default: "PENDIENTE"
    },
    creado:{
        type: Date,
        default: Date.now()
    },
}));


export default Pedido;