const { ApolloServer} = require("apollo-server-express");
const typeDefs = require("./schema");
const createResolvers = require("./resolvers");
const { verifyToken } = require("../auth");  



async function setupGraphql(app,io){
    //Inject Socket.IO into resolvers
    const resolvers = createResolvers(io);

    //Create Apollo graphql server
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        playground: true,
        introspection:true,
        context:({req , res})=>{
            const token = req.cookies?.token;
            const user = verifyToken(token);
            return{req,res,user,io};
    
        }
    });

    //Start Apollo Server
    await server.start();

    //attach graphql to express on graphql
  server.applyMiddleware({
  app,
  path: "/graphql",
  cors: {
    origin: 
      "http://localhost:4200",
      credentials: true,
      
    
    
  }
});


    console.log("✔ GraphQL is ready at /graphql");
}
module.exports = setupGraphql;