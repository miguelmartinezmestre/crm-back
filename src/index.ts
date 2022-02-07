import { ApolloServer } from 'apollo-server'
import  {ApolloServerPluginLandingPageGraphQLPlayground} from 'apollo-server-core'
import  {typeDefs} from './typeDefs';
import  {resolvers} from './resolvers'
import {verify} from "jsonwebtoken"
require("dotenv").config();
import  {conectarDb} from "./db"
conectarDb();
const server = new ApolloServer({
        typeDefs,
        resolvers,
        context: async(context)=>{
            const token = context.req.headers['authorization'] || '';

            if (token){
                try {
                    const usuario = verify(token.replace("Bearer ", ""), process.env.SECRET);

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
