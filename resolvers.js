const Usuario = require("./models/Usuario")
const Producto = require("./models/Producto")
const Cliente = require("./models/Cliente")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
require("dotenv").config();

const crearToken = (usuario, secret, caducidad) => {
    const {id, email, nombre, apellido} = usuario;
    return jwt.sign({
        id,
        email,
        nombre,
        apellido
    }, secret, {expiresIn: '24h'})
}

const resolvers={
    Query:{
        obtenerUsuario: async (_,__,context)=>{
            return context.usuario;
        },
        obtenerProdutos: async() =>{
            try {
                const productos = await Producto.find({});
                return productos;
            }catch (e) {
                console.log(e)
            }
        },
        obtenerProducto:async (_, {id})=>{
            try {
                const producto = await Producto.findById(id);
                if (!producto){
                    throw new Error("producto no encontrado");
                }
                return producto;
            }catch (e) {
                console.log(e)
            }
        },
        obtenerClientes:async ()=>{
            try {
                return await Cliente.find({});
            }catch (e) {
                console.log(e)
            }
        },
        obtenerClientesVendedor:async (_,__,context)=>{
            try {
                console.log(context.usuario.id.toString())
                const clientes = await Cliente.find({vendedor:context.usuario.id.toString()});
               // console.log(clientes)
                return clientes;
            }catch (e) {
                console.log(e)
            }
        },
        obtenerCliente:async (_, {id},context)=>{
            try {
                const cliente = await Cliente.findById(id);
                if (!cliente){
                    throw new Error("Cliente no encontrado");
                }
                if (cliente.vendedor.toString() !== context.usuario.id){
                    throw new Error("no tiene acceso")
                }
                // console.log(clientes)
                return cliente;
            }catch (e) {
                console.log(e)
            }
        }
    },
    Mutation:{
        nuevoUsuario: async (_, {input})=> {

            const {email, password} = input;

            const existe = Usuario.findOne({email});


            const salt  = await bcrypt.genSalt(10);
            input.password = await bcrypt.hash(password, salt);

            try{
                const usuario = new Usuario(input);
                await usuario.save();
                return usuario;
            }catch (e) {
                console.log(e)
            }
        },
        autenticarUsuario: async (_, {input})=>{
            const {email, password} = input;

            const existe = await Usuario.findOne({email});

            if (!existe){
                throw new Error("no existe");
            }

            const passwordCorrecto = await bcrypt.compare(password, existe.password);
            if (!passwordCorrecto){
                throw new Error("pass mal");
            }

            return{
                token: crearToken(existe, process.env.SECRET, "24h")
            }
        },
        nuevoProducto: async (_, {input})=>{
            try{
                const producto = new Producto(input);
                return await producto.save();
            }catch (e) {
                console.log(e)
            }
        },
        actualizarProducto: async(_, {id, input})=>{
            let producto = await Producto.findById(id);
            if (!producto){
                throw new Error("producto no encontrado");
            }

            producto = await Producto.findOneAndUpdate({_id:id}, input, {new:true});
            return producto
        },
        eliminarProducto: async (_,{id})=>{
            const producto = await Producto.findById(id);
            if (!producto){
                throw new Error("producto no encontrado");
            }

            await Producto.findOneAndDelete({_id:id});
            return "Producto eliminado";
        },
        nuevoCliente: async (_, {input}, context)=>{
            // console.log(context)
            const {email} = input;
            const cliente = await Cliente.findOne({email});
            if (cliente){
                throw new Error("Ya esta en db")
            }
            const nuevoCliente = new Cliente(input);
            nuevoCliente.vendedor = context.usuario.id;
            try {
                return await nuevoCliente.save();
            }catch (e) {
                console.log(e);
            }

        }
    }
}

module.exports = resolvers;
