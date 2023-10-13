const mongoose = require('mongoose')

const bookmarkSchema = new mongoose.Schema({
  blog_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Blog'
  },
  blog_owner_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  bookmark_by_user_id:
  {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  is_bookmark: {
    type: Boolean,
    default: false
  },
},
  {
    timestamps: true
  })

module.exports = mongoose.model('Bookmark', bookmarkSchema)