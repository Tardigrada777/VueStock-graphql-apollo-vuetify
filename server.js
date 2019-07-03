const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

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

// create Apollo/GraphQL server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post
  }
});

// node server init
server.listen().then(({ url }) => {
  console.log(`Server listening on ${url}`);
});
