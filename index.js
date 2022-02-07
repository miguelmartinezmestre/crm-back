const { ApolloServer } = require('apollo-server');
const  {ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');
const typeDefs = require('./typeDefs');
const {getUser,resolvers} = require('./resolvers');
const jwt = require("jsonwebtoken")
require("dotenv").config();
const conectardb = require("./db")
conectardb();
const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async(context)=>{
            const token = context.req.headers['authorization'] || '';

            if (token){
                try {
                    const usuario = jwt.verify(token.replace("Bearer ", ""), process.env.SECRET);

                    return{
                        usuario
                    }

                }catch (e) {
                    console.log(e);
                }
            }
        },
        plugins:[
           // ApolloServerPluginLandingPageGraphQLPlayground(),
        ]
});

server.listen( 4000).then( ({url}) => {
    console.log(`Servidor listo en la URL ${url}`)
} );
