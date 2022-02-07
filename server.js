const express = require('express');
const { ApolloServer, gql } = require('apollo-server-express');
const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

async function server(){
    const server = new ApolloServer({ 
        typeDefs,
        resolvers,
        context:({req,res})=>{req,res},
        cors: {
            origin: 'http://localhost:3000/login'
        }
    });

    const app = express();
    await server.start();
    server.applyMiddleware({ 
        app
    });

    app.listen({ port: 4000 }, () =>
    console.log(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`)
    );
}
server()