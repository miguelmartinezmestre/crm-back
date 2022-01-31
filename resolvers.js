const Usuario = require("./models/Usuario")
const Producto = require("./models/Producto")
const Cliente = require("./models/Cliente")
const Pedido = require("./models/Pedido")
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
        obtenerUsuario: async (_, {token})=>{
            const usuarioId = await jwt.verify(token, process.env.SECRET);
            return usuarioId;
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
        },
        obtenerPedidos:async ()=>{
            try {
                const pedidos = await Pedido.find({});
                return pedidos;
            }catch (e) {
                console.log(e)
            }
        },
        obtenerPedidosVendedor:async (_, __,context)=>{
            try {
                const pedidos = await Pedido.find({vendedor: context.usuario.id});

                // console.log(clientes)
                return pedidos;
            }catch (e) {
                console.log(e)
            }
        },
        obtenerPedido:async (_, {id},context)=>{
            try {
                const pedido = await Pedido.findById(id);

                if (!pedido){
                    throw new Error("Pedido no encontrado");
                }
                if (pedido.vendedor.toString() !== context.usuario.id){
                    throw new Error("no tiene acceso")
                }

                // console.log(clientes)
                return pedido;
            }catch (e) {
                console.log(e)
            }
        },
        obtenerPedidosEstado:async (_, {estado},context)=>{
            try {
                const pedido = await Pedido.find({vendedor:context.usuario.id,estado: estado});
                return pedido;
            }catch (e) {
                console.log(e)
            }
        },
        obtenerMejoresClientes:async ()=>{
            const clientes = await Pedido.aggregate([
                {$match: {estado:"COMPLETADO"} },
                {$group: {
                     _id:"$cliente",
                     total:{$sum:'$total'}
                }},
                {
                   $lookup:{
                       from:'clientes',
                       localField:'_id',
                       foreignField:'_id',
                       as: 'cliente'
                        }
                    },
                {
                    $sort:{total:-1}
                    }
                ]);
            return clientes;
        },
        obtenerMejoresVendedores:async ()=>{
            const vendedores = await Pedido.aggregate([
                {$match: {estado:"COMPLETADO"} },
                {$group: {
                        _id:"$vendedor",
                        total:{$sum:'$total'}
                    }},
                {
                    $lookup:{
                        from:'usuarios',
                        localField:'_id',
                        foreignField:'_id',
                        as: 'vendedor'
                    }
                },
                {
                    $limit:3
                },
                {
                    $sort:{total:-1}
                }
            ]);
            console.log(vendedores)
            return vendedores;
        },
        buscarProducto:async (_,{texto})=>{
            const productos = await Producto.find({$text:{ $search: texto}});
            return productos;
        }
    },
    Mutation:{
        nuevoUsuario: async (_, {input})=> {

            const {email, password} = input;

            const existe = await Usuario.findOne({email});

            if (existe){
                throw new Error("El usuario ya existe");
            }

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

        },
        actualizarCliente: async (_, {id,input},context)=>{
            try {
                let cliente = await Cliente.findById(id);
                if (!cliente){
                    throw new Error("Cliente no encontrado");
                }
                if (cliente.vendedor.toString() !== context.usuario.id){
                    throw new Error("no tiene acceso")
                }
                // console.log(clientes)

                cliente = await Cliente.findOneAndUpdate({_id: id}, input,{new:true});

                return cliente;
                }catch (e) {
                    console.log(e)
                }
            },
        eliminarCliente: async (_, {id},context)=>{
            try {
                const cliente = await Cliente.findById(id);
                if (!cliente){
                    throw new Error("Cliente no encontrado");
                    return "error"
                }
                if (cliente.vendedor.toString() !== context.usuario.id){
                    throw new Error("no tiene acceso")
                }
                // console.log(clientes)

                await Cliente.findOneAndDelete({_id: id});

                return "Eliminado";
            }catch (e) {
                console.log(e)
                }
            },
        nuevoPedido: async (_, {input},context)=>{
            try {
                const client = await Cliente.findById(input.cliente);
                if (!client){
                    throw new Error("Cliente no encontrado");
                }
                if (client.vendedor.toString() !== context.usuario.id){
                    throw new Error("no tiene acceso")
                }
                // console.log(clientes)

                for await (const articulo of input.pedido){
                    const {id} = articulo;
                    const producto = await Producto.findById(id);
                    if (articulo.cantidad > producto.existencia){
                        throw new Error(`El articulo: ${producto.nombre} excede la cantidad`);
                    }
                    producto.existencia = producto.existencia - articulo.cantidad;
                    await producto.save();
                }

                const pedido = new Pedido(input);

                pedido.vendedor = context.usuario.id;

                const resultado = await pedido.save();
                return resultado;
            }catch (e) {
                console.log(e)
            }
        },
        actualizarPedido:async (_, {id,input},context)=>{
            try {
                let pedido = await Pedido.findById(id);
                if (!pedido){
                    throw new Error("Pedido no encontrado");
                }

                const cliente = await Cliente.findById(input.cliente);
                if (!cliente){
                    throw new Error("Cliente no encontrado");
                }

                if (cliente.vendedor.toString() !== context.usuario.id){
                    throw new Error("no tiene acceso")
                }
                // console.log(clientes)

                if (!input.pedido){
                    throw new Error("no hay pedido acceso")
                }

                for await (const articulo of input.pedido){
                    const {id} = articulo;
                    const producto = await Producto.findById(id);
                    if (articulo.cantidad > producto.existencia){
                        throw new Error(`El articulo: ${producto.nombre} excede la cantidad`);
                    }
                    producto.existencia = producto.existencia - articulo.cantidad;
                    await producto.save();
                }

                pedido = await Pedido.findOneAndUpdate({_id: id}, input,{new:true});

                return pedido;
            }catch (e) {
                console.log(e)
            }
        },
        eliminarPedido: async (_,{id},context)=>{
            const pedido = await Pedido.findById(id);

            if (!pedido){
                throw new Error("Pedido no encontrado");
            }

            if (pedido.vendedor.toString() !== context.usuario.id){
                throw new Error("no tiene acceso")
            }

            await Pedido.findOneAndDelete({_id:id});
            return "Pedido eliminado";
        },
    }
}

module.exports = resolvers;
