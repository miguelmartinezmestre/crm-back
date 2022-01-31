const { gql } = require("apollo-server");

const typeDefs = gql`
    
    type Usuario{
        id: ID
        nombre: String
        apellidos: String
        email: String
        creado: String
    }
    
    type Token{
        token: String!
    }
    
    type Producto{
        id: ID
        nombre:String
        existencia: Int
        precio:Float
        creado: String
    }
    
    type Cliente{
        id: ID
        nombre:String!
        apellido:String!
        empresa:String!
        email:String!
        telefono:String!
        vendedor: ID!
    }
    
    type PedidoGrupo{
        id:ID
        cantidad: Int
    }
    
    type Pedido{
        id: ID
        pedido:[PedidoGrupo]!
        total: Float!
        cliente:ID!
        vendedor: ID!
        fecha: String
        estado: Estado!
        
    }

    type Clientesinid{
        nombre:String!
        apellido:String!
        empresa:String!
        email:String!
        telefono:String!
        vendedor: ID!
    }
    
    type TopCliente{
        total: Float
        cliente:[Clientesinid]
    }

    type Usuariosinid{
        nombre: String
        apellidos: String
        email: String
        creado: String
    }
    
    type TopVendedor{
        total: Float
        vendedor:[Usuariosinid]
    }
    
    input UsuarioInput{
        nombre: String!
        apellidos: String!
        email: String!
        password: String!
    }
    
    input AutenticarInput{
        email:String!
        password:String!
    }
    
    input ProductoInput{
        nombre:String!
        existencia: Int!
        precio:Float!
    }

    input PedidoProductoInput{
        id:ID
        cantidad: Int
    }
    
    enum Estado{
        PENDIENTE
        COMPLETADO
        CANCELADO
    }
    
    input PedidoInput{
        pedido:[PedidoProductoInput]!
        total: Float
        cliente:ID!
        estado: Estado
    }
    
    
    input ClienteInput{
        nombre:String!
        apellido:String!
        empresa:String!
        email:String!
        telefono:String!
    }
    
    type Query{
        obtenerUsuario(token:String!):Usuario

        obtenerProdutos: [Producto]
        obtenerProducto(id: ID!): Producto
        
        obtenerClientes: [Cliente]
        obtenerClientesVendedor:[Cliente]
        obtenerCliente(id: ID!):Cliente
        
        obtenerPedidos: [Pedido]
        obtenerPedidosVendedor: [Pedido]
        obtenerPedido(id:ID!):Pedido
        obtenerPedidosEstado(estado: Estado!):[Pedido]
        
        obtenerMejoresClientes:[TopCliente]
        obtenerMejoresVendedores:[TopVendedor]
        
        buscarProducto(texto:String!):[Producto]
    }
    type Mutation{
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
        
        nuevoProducto(input:ProductoInput):Producto
        actualizarProducto(id: ID, input: ProductoInput):Producto
        eliminarProducto(id: ID!):String
        
        nuevoCliente(input: ClienteInput):Cliente
        actualizarCliente(id:ID!, input:ClienteInput):Cliente
        eliminarCliente(id: ID!):String
        
        nuevoPedido(input: PedidoInput):Pedido
        actualizarPedido(id:ID!, input: PedidoInput):Pedido
        eliminarPedido(id:ID!):String
    }
    
`;
module.exports = typeDefs;
