const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) return null;

      const user = await User.findOne({
        username: currentUser.username
      }).populate({
        path: "favorites",
        model: "Post"
      });

      return user;
    },
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const posts = await Post.find({
        createdBy: userId
      });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post;
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResults = await Post.find(
          // Perform text search for search value of 'searchTerm'
          { $text: { $search: searchTerm } },
          // Asign 'searchTerm' a text score to provide best match
          { score: { $meta: "textScore" } }
        )
          .sort({
            score: { $meta: "textScore" },
            likes: "desc"
          })
          .limit(5);
        return searchResults;
      }
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;

      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .limit(pageSize);
      } else {
        // if pageNum greater then 1
        const skips = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User"
          })
          .skip(skips)
          .limit(pageSize);
      }
      const totalDocs = await Post.countDocuments();
      const hasMore = totalDocs > pageSize * pageNum;
      return { posts, hasMore };
    }
  },
  Mutation: {
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },
    deleteUserPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOneAndRemove({ _id: postId });
      return post;
    },
    updateUserPost: async (
      _,
      { postId, userId, title, description, imageUrl, categories },
      { Post }
    ) => {
      const post = await Post.findOneAndUpdate(
        // find post by postId and userId (createdBy)
        { _id: postId, createdBy: userId },
        {
          $set: {
            title,
            imageUrl,
            categories,
            description
          }
        },
        {
          new: true
        }
      );

      return post;
    },
    signinUser: async (_, { username, password }, { User }) => {
      const user = await User.findOne({ username });
      if (!user) throw new Error("User not found");

      const isValidPassword = await bcrypt.compare(password, user.password);

      if (!isValidPassword) {
        throw new Error("Invalid password");
      }

      return {
        token: createToken(user, process.env.SECRET, "1hr")
      };
    },
    signupUser: async (_, { username, email, password }, { User }) => {
      const user = await User.findOne({ username });
      if (user) throw new Error("User already exist");

      const newUser = await new User({
        username,
        email,
        password
      }).save();

      return {
        token: createToken(newUser, process.env.SECRET, "1hr")
      };
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId
      };

      const post = await Post.findOneAndUpdate(
        // Find Post by id
        { _id: postId },
        // ADd a new message to the messages array
        {
          $push: {
            messages: { $each: [newMessage], $position: 0 }
          }
        },
        // return fresh doc after update
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User"
      });
      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post, and +1 to its like value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );

      // Find user, add id of post to its favorites array
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });

      // return only likes from 'post' and favorites from user
      return { likes: post.likes, favorites: user.favorites };
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post, and -1 to its like value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );

      // Find user, add id of post to its favorites array
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post"
      });

      // return only likes from 'post' and favorites from user
      return { likes: post.likes, favorites: user.favorites };
    }
  }
};
