const { ApolloServer } = require('apollo-server');
const  {ApolloServerPluginLandingPageDisabled} = require('apollo-server-core');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');
const jwt = require("jsonwebtoken")
require("dotenv").config();
const conectardb = require("./db")
conectardb();
const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async({req})=>{
            // console.log(req.headers['authorization'])

            const token = req.headers['authorization'] || '';



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
            // ApolloServerPluginLandingPageDisabled(),
        ]
});

server.listen( 4000).then( ({url}) => {
    console.log(`Servidor listo en la URL ${url}`)
} );
