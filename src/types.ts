import { Schema } from "mongoose";

export interface UsuarioType{
    id:string
    nombre: string
    apellidos: string
    email: string
    password: string
    creado: Date | number | string
}

export interface ProductoType{
    id: string
    nombre:string
    existencia: number
    precio:number
    creado: Date | number | string
}

export interface ClienteType{
    id: string
    nombre:string
    apellido:string
    empresa:string
    email:string
    telefono:string
    vendedor: Schema.Types.ObjectId
    creado: Date | number | string
}

interface itemPedido{
    id: string
    cantidad: number
}

export interface PedidoType{
    id: string
    pedido: Array<itemPedido> | any
    total: number
    cliente:Schema.Types.ObjectId
    vendedor: Schema.Types.ObjectId
    creado: Date | number | string
    estado: "PENDIENTE" | "COMPLETADO" | "CANCELADO" 
}
