const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// import typeDefs and reslovers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers.js");

// import env vars and mongoose models
require("dotenv").config({ path: ".env" });

const User = require("./models/User");
const Post = require("./models/Post");

// connect to mlab db
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => {
    console.log("DB connected");
  })
  .catch(err => console.log(err));

// verify JWT Token from client
const getUser = async token => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw new AuthenticationError(
        "Your session has ended. Please sign in again"
      );
    }
  }
};

// create Apollo/GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  formatError: error => {
    return {
      name: error.name,
      message: error.message.replace("Context creation failed:", "")
    };
  },
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return {
      User,
      Post,
      currentUser: await getUser(token)
    };
  }
});

// node server init
server.listen({ port: process.env.PORT || 4000 }).then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
