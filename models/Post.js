const Mongoose = require("mongoose");

const PostSchema = new Mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  categories: {
    type: [String],
    required: true
  },
  description: {
    type: String,
    required: true
  },
  createdDate: {
    type: Date,
    default: Date.now
  },
  likes: {
    type: Number,
    default: 0
  },
  createdBy: {
    type: Mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  messages: [
    {
      messageBody: {
        type: String,
        required: true
      },
      messageDate: {
        type: Date,
        default: Date.now
      },
      messageUser: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    }
  ]
});

// create index to search on all fields of posts
PostSchema.index({
  "$**": "text"
});

module.exports = Mongoose.model("Post", PostSchema);
