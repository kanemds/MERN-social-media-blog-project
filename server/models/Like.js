const mongoose = require('mongoose')

const likeSchema = new mongoose.Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Blog'
  },
  blog_owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  liked_by_user_id:
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  liked_by_user_username: {
    type: String,
    required: true,
  },
  is_like: {
    type: Boolean,
    default: false
  },
  likes: {
    type: Number,
    default: 0
  }
},
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Like', likeSchema)