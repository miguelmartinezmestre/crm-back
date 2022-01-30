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
        id: ID!
        nombre:String!
        apellido:String!
        empresa:String!
        email:String!
        telefono:String!
        vendedor: ID!
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
    
    input ClienteInput{
        nombre:String!
        apellido:String!
        empresa:String!
        email:String!
        telefono:String!
    }
    
    type Query{
        obtenerUsuario:Usuario

        obtenerProdutos: [Producto]
        obtenerProducto(id: ID!): Producto
        
        obtenerClientes: [Cliente]
        obtenerClientesVendedor:[Cliente]
        obtenerCliente(id: ID!):Cliente
    }
    type Mutation{
        nuevoUsuario(input: UsuarioInput): Usuario
        autenticarUsuario(input: AutenticarInput): Token
        
        nuevoProducto(input:ProductoInput):Producto
        actualizarProducto(id: ID, input: ProductoInput):Producto
        eliminarProducto(id: ID!):String
        
        nuevoCliente(input: ClienteInput):Cliente
    }
    
`;
module.exports = typeDefs;
