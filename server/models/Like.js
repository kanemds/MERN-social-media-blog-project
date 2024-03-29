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
  is_like: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Like', likeSchema)